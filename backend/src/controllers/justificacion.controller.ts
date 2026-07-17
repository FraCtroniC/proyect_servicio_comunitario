import { Request, Response } from 'express';
import { Justificacion, AsistenciaDocente, Usuario, sequelize } from '../models';
import { wrapAsync } from '../shared/utils/wrapAsync';
import {
  crearJustificacionSchema,
  actualizarJustificacionSchema,
} from '../validators/justificacion.schema';

export const JustificacionController = {
  listar: wrapAsync(async (_req: Request, res: Response) => {
    const result = await Justificacion.findAll({
      include: [
        {
          model: AsistenciaDocente,
          as: 'asistencia',
          include: [{ model: Usuario, as: 'docente' }]
        }
      ],
      order: [['created_at', 'DESC']]
    });
    res.json({ data: result });
  }),

  obtenerPorId: wrapAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const result = await Justificacion.findByPk(id, {
      include: [
        {
          model: AsistenciaDocente,
          as: 'asistencia',
          include: [{ model: Usuario, as: 'docente' }]
        }
      ]
    });
    if (!result) {
      res.status(404).json({ error: { message: 'Recurso no encontrado' } });
      return;
    }
    res.json({ data: result });
  }),

  listarPorAsistencia: wrapAsync(async (req: Request, res: Response) => {
    const idAsistencia = Number(req.params.id_asistencia);
    const result = await Justificacion.findAll({
      where: { id_asistencia: idAsistencia },
      order: [['created_at', 'DESC']]
    });
    res.json({ data: result });
  }),

  crear: wrapAsync(async (req: Request, res: Response) => {
    const parsed = crearJustificacionSchema.safeParse(req.body);
    if (!parsed.success) {
      const details: Record<string, string[]> = {};
      for (const issue of parsed.error.issues) {
        const path = issue.path.join('.') || '_root';
        (details[path] ??= []).push(issue.message);
      }
      res.status(400).json({ error: { message: 'Error de validación', details } });
      return;
    }

    const { id_asistencia, motivo, soporte_digital } = parsed.data;

    const asistencia = await AsistenciaDocente.findByPk(id_asistencia);
    if (!asistencia || asistencia.fecha_anulacion) {
      res.status(404).json({ error: { message: 'Registro de asistencia no encontrado' } });
      return;
    }

    const result = await sequelize.transaction(async (t) => {
      const justificacion = await Justificacion.create(
        {
          id_asistencia,
          motivo,
          soporte_digital: soporte_digital || null,
        },
        { transaction: t }
      );

      await asistencia.update({ estatus: 'Justificado' }, { transaction: t });

      return justificacion;
    });
    res.status(201).json({ data: result });
  }),

  actualizar: wrapAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const record = await Justificacion.findByPk(id);
    if (!record) {
      res.status(404).json({ error: { message: 'Recurso no encontrado' } });
      return;
    }

    const parsed = actualizarJustificacionSchema.safeParse(req.body);
    if (!parsed.success) {
      const details: Record<string, string[]> = {};
      for (const issue of parsed.error.issues) {
        const path = issue.path.join('.') || '_root';
        (details[path] ??= []).push(issue.message);
      }
      res.status(400).json({ error: { message: 'Error de validación', details } });
      return;
    }

    await record.update(parsed.data);
    res.json({ data: record });
  }),

  eliminar: wrapAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const record = await Justificacion.findByPk(id);
    if (!record) {
      res.status(404).json({ error: { message: 'Recurso no encontrado' } });
      return;
    }

    await sequelize.transaction(async (t) => {
      const asistencia = await AsistenciaDocente.findByPk(record.id_asistencia, { transaction: t });
      if (asistencia && asistencia.estatus === 'Justificado') {
        await asistencia.update({ estatus: 'Ausente' }, { transaction: t });
      }
      await record.destroy({ transaction: t });
    });
    res.status(204).send();
  }),
};
