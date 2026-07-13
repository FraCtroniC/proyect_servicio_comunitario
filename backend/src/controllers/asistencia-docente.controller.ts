import { Op } from 'sequelize';
import { Response } from 'express';
import { AsistenciaDocente, Justificacion, Docente, sequelize } from '../models';
import { wrapAsync } from '../shared/utils/wrapAsync';
import { ASISTENCIA_DOCENTE_STATUS, HORA_LIMITE_PUNTUAL } from '../shared/constants';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { broadcastAsistenciaDocenteEvent } from './asistencia-docente-stream.controller';

const ALLOWED_CREATE_FIELDS = ['id_docente', 'fecha', 'hora_entrada', 'hora_salida', 'estatus'];
const ALLOWED_UPDATE_FIELDS = ['hora_entrada', 'hora_salida', 'estatus'];

function isValidDate(dateStr: string): boolean {
  const d = new Date(dateStr);
  return !isNaN(d.getTime());
}

function isFutureDate(dateStr: string): boolean {
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return new Date(dateStr) > today;
}

function compareTime(t1: string, t2: string): number {
  const [h1, m1] = t1.split(':').map(Number);
  const [h2, m2] = t2.split(':').map(Number);
  if (h1 !== h2) return h1 - h2;
  return m1 - m2;
}

export const AsistenciaDocenteController = {
  listar: wrapAsync(async (req: AuthenticatedRequest, res: Response) => {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 50));
    const offset = (page - 1) * limit;

    const where: any = {};
    if (req.query.fecha) where.fecha = String(req.query.fecha);
    if (req.query.id_docente) where.id_docente = Number(req.query.id_docente);
    if (req.query.estatus) where.estatus = String(req.query.estatus);

    if (req.query.fecha_desde || req.query.fecha_hasta) {
      where.fecha = {};
      if (req.query.fecha_desde) where.fecha[Op.gte] = String(req.query.fecha_desde);
      if (req.query.fecha_hasta) where.fecha[Op.lte] = String(req.query.fecha_hasta);
    }

    const { count, rows } = await AsistenciaDocente.findAndCountAll({
      where,
      include: [
        { model: Justificacion, as: 'justificaciones' },
        { model: Docente, as: 'docente' }
      ],
      limit,
      offset,
      order: [['fecha', 'DESC'], ['id_asistencia', 'DESC']]
    });
    res.json({ data: rows, meta: { total: count, page, limit, pages: Math.ceil(count / limit) } });
  }),

  obtenerPorId: wrapAsync(async (req: AuthenticatedRequest, res: Response) => {
    const id = Number(req.params.id);
    const result = await AsistenciaDocente.findByPk(id, {
      include: [
        { model: Justificacion, as: 'justificaciones' },
        { model: Docente, as: 'docente' }
      ]
    });
    if (!result) {
      res.status(404).json({ error: { message: 'Recurso no encontrado' } });
      return;
    }
    res.json({ data: result });
  }),

  crear: wrapAsync(async (req: AuthenticatedRequest, res: Response) => {
    const payload: any = {};
    for (const field of ALLOWED_CREATE_FIELDS) {
      if (req.body[field] !== undefined) payload[field] = req.body[field];
    }

    if (!payload.id_docente || !payload.fecha) {
      res.status(400).json({ error: { message: 'id_docente y fecha son requeridos' } });
      return;
    }

    if (!isValidDate(payload.fecha)) {
      res.status(400).json({ error: { message: 'fecha no es una fecha válida' } });
      return;
    }

    if (isFutureDate(payload.fecha)) {
      res.status(400).json({ error: { message: 'No se puede registrar asistencia en una fecha futura' } });
      return;
    }

    if (payload.estatus && !ASISTENCIA_DOCENTE_STATUS.includes(payload.estatus)) {
      res.status(400).json({ error: { message: `estatus debe ser: ${ASISTENCIA_DOCENTE_STATUS.join(', ')}` } });
      return;
    }

    if (!payload.estatus && payload.hora_entrada) {
      payload.estatus = compareTime(payload.hora_entrada, HORA_LIMITE_PUNTUAL) <= 0
        ? 'Puntual'
        : 'Retardo';
    }

    const existing = await AsistenciaDocente.findOne({
      where: { id_docente: payload.id_docente, fecha: payload.fecha }
    });
    if (existing) {
      res.status(409).json({ error: { message: 'Ya existe un registro de asistencia para este docente en esta fecha' } });
      return;
    }

    const result = await AsistenciaDocente.create(payload);
    broadcastAsistenciaDocenteEvent({ tipo: 'create', data: result });
    res.status(201).json({ data: result });
  }),

  actualizar: wrapAsync(async (req: AuthenticatedRequest, res: Response) => {
    const id = Number(req.params.id);
    const record = await AsistenciaDocente.findByPk(id);
    if (!record) {
      res.status(404).json({ error: { message: 'Recurso no encontrado' } });
      return;
    }

    const payload: any = {};
    for (const field of ALLOWED_UPDATE_FIELDS) {
      if (req.body[field] !== undefined) payload[field] = req.body[field];
    }

    if (payload.estatus && !ASISTENCIA_DOCENTE_STATUS.includes(payload.estatus)) {
      res.status(400).json({ error: { message: `estatus debe ser: ${ASISTENCIA_DOCENTE_STATUS.join(', ')}` } });
      return;
    }

    const horaEntrada = payload.hora_entrada ?? record.hora_entrada;
    const horaSalida = payload.hora_salida ?? record.hora_salida;

    if (horaEntrada && horaSalida && compareTime(horaSalida, horaEntrada) <= 0) {
      res.status(400).json({ error: { message: 'La hora de salida debe ser posterior a la hora de entrada' } });
      return;
    }

    await record.update(payload);
    broadcastAsistenciaDocenteEvent({ tipo: 'update', data: record });
    res.json({ data: record });
  }),

  eliminar: wrapAsync(async (req: AuthenticatedRequest, res: Response) => {
    const id = Number(req.params.id);
    const record = await AsistenciaDocente.findByPk(id);
    if (!record) {
      res.status(404).json({ error: { message: 'Recurso no encontrado' } });
      return;
    }
    await record.destroy();
    broadcastAsistenciaDocenteEvent({ tipo: 'delete', data: record });
    res.status(204).send();
  }),

  estadisticas: wrapAsync(async (req: AuthenticatedRequest, res: Response) => {
    const { id_docente, fecha_desde, fecha_hasta } = req.query;

    const whereConditions: string[] = [];
    const replacements: any[] = [];

    if (id_docente) {
      whereConditions.push('ad.id_docente = ?');
      replacements.push(Number(id_docente));
    }
    if (fecha_desde) {
      whereConditions.push('ad.fecha >= ?');
      replacements.push(String(fecha_desde));
    }
    if (fecha_hasta) {
      whereConditions.push('ad.fecha <= ?');
      replacements.push(String(fecha_hasta));
    }

    const whereClause = whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ') : '';

    const query = `
      SELECT
        d.id_docente,
        d.nombre,
        d.apellido,
        d.cedula,
        SUM(CASE WHEN ad.estatus = 'Puntual' THEN 1 ELSE 0 END) AS puntual,
        SUM(CASE WHEN ad.estatus = 'Retardo' THEN 1 ELSE 0 END) AS retardo,
        SUM(CASE WHEN ad.estatus = 'Ausente' THEN 1 ELSE 0 END) AS ausente,
        COUNT(*) AS total
      FROM asistencia_docente ad
      INNER JOIN docentes d ON d.id_docente = ad.id_docente
      ${whereClause}
      GROUP BY d.id_docente, d.nombre, d.apellido, d.cedula
      ORDER BY d.apellido, d.nombre
    `;

    const [results]: any = await sequelize.query(query, { replacements });

    const stats = results.map((s: any) => ({
      id_docente: s.id_docente,
      nombre: `${s.apellido}, ${s.nombre}`,
      cedula: s.cedula,
      puntual: Number(s.puntual),
      retardo: Number(s.retardo),
      ausente: Number(s.ausente),
      total: Number(s.total),
      porcentaje_puntualidad: Number(s.total) > 0
        ? Math.round((Number(s.puntual) / Number(s.total)) * 100)
        : 0
    }));

    res.json({ data: stats });
  }),
};
