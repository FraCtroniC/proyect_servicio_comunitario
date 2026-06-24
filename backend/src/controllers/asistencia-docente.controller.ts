import { Request, Response } from 'express';
import { AsistenciaDocente, Justificacion, Docente } from '../models';
import { wrapAsync } from '../shared/utils/wrapAsync';

const ALLOWED_STATUSES = ['Puntual', 'Retardo', 'Ausente'];
const ALLOWED_CREATE_FIELDS = ['id_docente', 'fecha', 'hora_entrada', 'hora_salida', 'estatus'];
const ALLOWED_UPDATE_FIELDS = ['hora_entrada', 'hora_salida', 'estatus'];

export const AsistenciaDocenteController = {
  listar: wrapAsync(async (req: Request, res: Response) => {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 50));
    const offset = (page - 1) * limit;

    const where: any = {};
    if (req.query.fecha) where.fecha = String(req.query.fecha);
    if (req.query.id_docente) where.id_docente = Number(req.query.id_docente);

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

  obtenerPorId: wrapAsync(async (req: Request, res: Response) => {
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

  crear: wrapAsync(async (req: Request, res: Response) => {
    const payload: any = {};
    for (const field of ALLOWED_CREATE_FIELDS) {
      if (req.body[field] !== undefined) payload[field] = req.body[field];
    }

    if (!payload.id_docente || !payload.fecha) {
      res.status(400).json({ error: { message: 'id_docente y fecha son requeridos' } });
      return;
    }

    if (payload.estatus && !ALLOWED_STATUSES.includes(payload.estatus)) {
      res.status(400).json({ error: { message: 'estatus debe ser: Puntual, Retardo o Ausente' } });
      return;
    }

    const existing = await AsistenciaDocente.findOne({
      where: { id_docente: payload.id_docente, fecha: payload.fecha }
    });
    if (existing) {
      res.status(409).json({ error: { message: 'Ya existe un registro de asistencia para este docente en esta fecha' } });
      return;
    }

    const result = await AsistenciaDocente.create(payload);
    res.status(201).json({ data: result });
  }),

  actualizar: wrapAsync(async (req: Request, res: Response) => {
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

    if (payload.estatus && !ALLOWED_STATUSES.includes(payload.estatus)) {
      res.status(400).json({ error: { message: 'estatus debe ser: Puntual, Retardo o Ausente' } });
      return;
    }

    await record.update(payload);
    res.json({ data: record });
  }),

  eliminar: wrapAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const record = await AsistenciaDocente.findByPk(id);
    if (!record) {
      res.status(404).json({ error: { message: 'Recurso no encontrado' } });
      return;
    }
    await record.destroy();
    res.status(204).send();
  }),
};
