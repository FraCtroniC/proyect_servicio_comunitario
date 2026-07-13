import { Op, fn, col } from 'sequelize';
import { Request, Response } from 'express';
import { AsistenciaEstudiante, Matricula, Estudiante, Seccion, Calificacion, PeriodoEscolar, sequelize } from '../models';
import { wrapAsync } from '../shared/utils/wrapAsync';
import { ASISTENCIA_ESTUDIANTE_STATUS } from '../shared/constants';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

const ALLOWED_CREATE_FIELDS = ['id_matricula', 'fecha', 'estatus', 'observacion'];
const ALLOWED_UPDATE_FIELDS = ['estatus', 'observacion'];

const MATRICULA_INCLUDES = [{
  model: Matricula, as: 'matricula',
  include: [
    { model: Estudiante, as: 'estudiante' },
    { model: Seccion, as: 'seccion' }
  ]
}];

function isValidDate(dateStr: string): boolean {
  const d = new Date(dateStr);
  return !isNaN(d.getTime());
}

function isFutureDate(dateStr: string): boolean {
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return new Date(dateStr) > today;
}

export const AsistenciaEstudianteController = {
  listar: wrapAsync(async (req: Request, res: Response) => {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 50));
    const offset = (page - 1) * limit;

    const where: any = {};
    if (req.query.fecha) where.fecha = String(req.query.fecha);
    if (req.query.id_matricula) where.id_matricula = Number(req.query.id_matricula);
    if (req.query.estatus) where.estatus = String(req.query.estatus);

    if (req.query.fecha_desde || req.query.fecha_hasta) {
      where.fecha = {};
      if (req.query.fecha_desde) where.fecha[Op.gte] = String(req.query.fecha_desde);
      if (req.query.fecha_hasta) where.fecha[Op.lte] = String(req.query.fecha_hasta);
    }

    const include: any[] = [
      {
        model: Matricula,
        as: 'matricula',
        include: [
          { model: Estudiante, as: 'estudiante' },
          { model: Seccion, as: 'seccion' }
        ]
      }
    ];

    if (req.query.id_seccion) {
      include[0].where = { id_seccion: Number(req.query.id_seccion) };
    }

    const { count, rows } = await AsistenciaEstudiante.findAndCountAll({
      where,
      include,
      limit,
      offset,
      order: [['fecha', 'DESC'], ['id_asistencia_est', 'DESC']]
    });
    res.json({ data: rows, meta: { total: count, page, limit, pages: Math.ceil(count / limit) } });
  }),

  crear: wrapAsync(async (req: AuthenticatedRequest, res: Response) => {
    const payload: any = {};
    for (const field of ALLOWED_CREATE_FIELDS) {
      if (req.body[field] !== undefined) payload[field] = req.body[field];
    }

    if (!payload.id_matricula || !payload.fecha) {
      res.status(400).json({ error: { message: 'id_matricula y fecha son requeridos' } });
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

    if (payload.estatus && !ASISTENCIA_ESTUDIANTE_STATUS.includes(payload.estatus)) {
      res.status(400).json({ error: { message: `estatus debe ser: ${ASISTENCIA_ESTUDIANTE_STATUS.join(', ')}` } });
      return;
    }

    if (payload.observacion === '') {
      payload.observacion = null;
    }

    const existing = await AsistenciaEstudiante.findOne({
      where: { id_matricula: payload.id_matricula, fecha: payload.fecha }
    });
    if (existing) {
      res.status(409).json({ error: { message: 'Ya existe un registro de asistencia para este estudiante en esta fecha' } });
      return;
    }

    payload.id_usuario_crea = req.user!.idUsuario;
    const nueva = await AsistenciaEstudiante.create(payload);
    const completa = await AsistenciaEstudiante.findByPk(nueva.id_asistencia_est, { include: MATRICULA_INCLUDES });
    res.status(201).json(completa || nueva);
  }),

  crearBatch: wrapAsync(async (req: AuthenticatedRequest, res: Response) => {
    const { registros } = req.body;

    if (!Array.isArray(registros) || registros.length === 0) {
      res.status(400).json({ error: { message: 'registros debe ser un array no vacío' } });
      return;
    }

    if (registros.some((r: any) => !r.id_matricula || !r.fecha)) {
      res.status(400).json({ error: { message: 'Cada registro debe tener id_matricula y fecha' } });
      return;
    }

    for (const r of registros) {
      if (r.estatus && !ASISTENCIA_ESTUDIANTE_STATUS.includes(r.estatus)) {
        res.status(400).json({ error: { message: `estatus debe ser: ${ASISTENCIA_ESTUDIANTE_STATUS.join(', ')}` } });
        return;
      }
      if (!isValidDate(r.fecha)) {
        res.status(400).json({ error: { message: `fecha ${r.fecha} no es válida` } });
        return;
      }
      if (isFutureDate(r.fecha)) {
        res.status(400).json({ error: { message: `No se puede registrar asistencia en fecha futura: ${r.fecha}` } });
        return;
      }
    }

    const idUsuario = req.user!.idUsuario;
    const result = await sequelize.transaction(async (t) => {
      const creados: any[] = [];
      for (const r of registros) {
        const payload = {
          id_matricula: r.id_matricula,
          fecha: r.fecha,
          estatus: r.estatus || 'Presente',
          observacion: r.observacion || null,
          id_usuario_crea: idUsuario,
        };

        const [registro, created] = await AsistenciaEstudiante.findOrCreate({
          where: { id_matricula: payload.id_matricula, fecha: payload.fecha },
          defaults: payload,
          transaction: t,
        });

        if (!created) {
          await registro.update({ estatus: payload.estatus, observacion: payload.observacion }, { transaction: t });
        }
        creados.push(registro);
      }
      return creados;
    });

    const completos = await Promise.all(
      result.map((r: any) => AsistenciaEstudiante.findByPk(r.id_asistencia_est, { include: MATRICULA_INCLUDES }))
    );
    const data = completos.map((r, i) => r || result[i]);
    res.status(201).json({ data, meta: { total: data.length } });
  }),

  estadisticas: wrapAsync(async (req: Request, res: Response) => {
    const { id_matricula, id_seccion, fecha_desde, fecha_hasta } = req.query;

    const whereConditions: string[] = [];
    const replacements: any[] = [];

    if (id_matricula) {
      whereConditions.push('ae.id_matricula = ?');
      replacements.push(Number(id_matricula));
    }
    if (id_seccion) {
      whereConditions.push('m.id_seccion = ?');
      replacements.push(Number(id_seccion));
    }
    if (fecha_desde) {
      whereConditions.push('ae.fecha >= ?');
      replacements.push(String(fecha_desde));
    }
    if (fecha_hasta) {
      whereConditions.push('ae.fecha <= ?');
      replacements.push(String(fecha_hasta));
    }

    const whereClause = whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ') : '';

    const query = `
      SELECT
        m.id_estudiante,
        CONCAT(e.apellido, ', ', e.nombre) AS nombre,
        e.cedula,
        CONCAT(s.id_grado, '° "', s.letra, '"') AS seccion,
        SUM(CASE WHEN ae.estatus = 'Presente' THEN 1 ELSE 0 END) AS presente,
        SUM(CASE WHEN ae.estatus = 'Ausente' THEN 1 ELSE 0 END) AS ausente,
        SUM(CASE WHEN ae.estatus = 'Justificado' THEN 1 ELSE 0 END) AS justificado,
        COUNT(*) AS total
      FROM asistencia_estudiante ae
      INNER JOIN matricula m ON m.id_matricula = ae.id_matricula
      INNER JOIN estudiantes e ON e.id_estudiante = m.id_estudiante
      INNER JOIN secciones s ON s.id_seccion = m.id_seccion
      ${whereClause}
      GROUP BY m.id_estudiante, e.apellido, e.nombre, e.cedula, s.id_grado, s.letra
      ORDER BY e.apellido, e.nombre
    `;

    const [results]: any = await sequelize.query(query, { replacements });

    const stats = results.map((s: any) => ({
      id_estudiante: s.id_estudiante,
      nombre: s.nombre,
      cedula: s.cedula,
      seccion: s.seccion,
      presente: Number(s.presente),
      ausente: Number(s.ausente),
      justificado: Number(s.justificado),
      total: Number(s.total),
      porcentaje_asistencia: Number(s.total) > 0
        ? Math.round(((Number(s.presente) + Number(s.justificado)) / Number(s.total)) * 100)
        : 100
    }));

    res.json({ data: stats });
  }),

  syncInasistencias: wrapAsync(async (req: Request, res: Response) => {
    const { id_matricula, id_periodo } = req.body;

    if (!id_matricula) {
      res.status(400).json({ error: { message: 'id_matricula es requerido' } });
      return;
    }

    const periodoId = Number(id_periodo) || null;
    let periodo: any = null;
    if (!periodoId) {
      periodo = await PeriodoEscolar.findOne({ where: { estatus: 'Activo' } });
    } else {
      periodo = await PeriodoEscolar.findByPk(periodoId);
    }

    if (!periodo) {
      res.status(400).json({ error: { message: 'No se encontró un período activo' } });
      return;
    }

    await sequelize.transaction(async (t) => {
      const ausenciasCount = await AsistenciaEstudiante.count({
        where: {
          id_matricula: Number(id_matricula),
          estatus: 'Ausente'
        },
        include: [{
          model: Matricula,
          as: 'matricula',
          where: { id_periodo: periodo.id_periodo },
          attributes: []
        }],
        transaction: t,
      });

      await Calificacion.update(
        { inasistencias_asignatura: ausenciasCount },
        { where: { id_matricula: Number(id_matricula) }, transaction: t }
      );
    });

    res.json({ data: { id_matricula: Number(id_matricula) } });
  }),

  syncInasistenciasBatch: wrapAsync(async (req: Request, res: Response) => {
    const { ids_matricula, id_periodo } = req.body;

    if (!Array.isArray(ids_matricula) || ids_matricula.length === 0) {
      res.status(400).json({ error: { message: 'ids_matricula debe ser un array no vacío' } });
      return;
    }

    const periodoId = Number(id_periodo) || null;
    let periodo: any = null;
    if (!periodoId) {
      periodo = await PeriodoEscolar.findOne({ where: { estatus: 'Activo' } });
    } else {
      periodo = await PeriodoEscolar.findByPk(periodoId);
    }

    if (!periodo) {
      res.status(400).json({ error: { message: 'No se encontró un período activo' } });
      return;
    }

    const ids = ids_matricula.map(Number);

    const results = await sequelize.transaction(async (t) => {
      const counts = await AsistenciaEstudiante.findAll({
        attributes: ['id_matricula', [fn('COUNT', col('AsistenciaEstudiante.id_asistencia_est')), 'total_ausencias']],
        where: {
          id_matricula: { [Op.in]: ids },
          estatus: 'Ausente'
        },
        include: [{
          model: Matricula,
          as: 'matricula',
          where: { id_periodo: periodo.id_periodo },
          attributes: []
        }],
        group: ['id_matricula'],
        transaction: t,
        raw: true,
      });

      const countMap: Record<number, number> = {};
      for (const r of counts as any[]) {
        countMap[r.id_matricula] = Number(r.total_ausencias);
      }

      for (const id of ids) {
        const ausencias = countMap[id] || 0;
        await Calificacion.update(
          { inasistencias_asignatura: ausencias },
          { where: { id_matricula: id }, transaction: t }
        );
      }

      return ids.map(id => ({ id_matricula: id, inasistencias: countMap[id] || 0 }));
    });

    res.json({ data: results, meta: { total: results.length } });
  }),

  actualizar: wrapAsync(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const record = await AsistenciaEstudiante.findByPk(id);
    if (!record) {
      res.status(404).json({ error: { message: 'Asistencia de estudiante no encontrada' } });
      return;
    }

    const payload: any = {};
    for (const field of ALLOWED_UPDATE_FIELDS) {
      if (req.body[field] !== undefined) payload[field] = req.body[field];
    }

    if (payload.estatus && !ASISTENCIA_ESTUDIANTE_STATUS.includes(payload.estatus)) {
      res.status(400).json({ error: { message: `estatus debe ser: ${ASISTENCIA_ESTUDIANTE_STATUS.join(', ')}` } });
      return;
    }

    if (payload.observacion === '') {
      payload.observacion = null;
    }

    payload.id_usuario_modifica = req.user!.idUsuario;
    await record.update(payload);
    const completa = await AsistenciaEstudiante.findByPk(record.id_asistencia_est, { include: MATRICULA_INCLUDES });
    res.json(completa || record);
  })
};
