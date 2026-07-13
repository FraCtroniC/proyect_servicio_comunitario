import { Request, Response } from 'express';
import { Justificacion } from '../models/Justificacion';
import { AsistenciaDocente } from '../models/AsistenciaDocente';
import { Docente } from '../models/Docente';
import { sequelize } from '../models';
import { wrapAsync } from '../shared/utils/wrapAsync';
import { broadcastJustificacionEvent } from './justificacion-stream.controller';

export const JustificacionController = {
  listar: wrapAsync(async (_req: Request, res: Response) => {
    const result = await Justificacion.findAll({
      include: [
        {
          model: AsistenciaDocente,
          as: 'asistencia',
          include: [{ model: Docente, as: 'docente' }]
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
          include: [{ model: Docente, as: 'docente' }]
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
    const { id_asistencia, motivo, soporte_digital } = req.body;

    if (!id_asistencia) {
      res.status(400).json({ error: { message: 'id_asistencia es requerido' } });
      return;
    }

    if (!motivo || !motivo.trim()) {
      res.status(400).json({ error: { message: 'El motivo de la justificación es requerido' } });
      return;
    }

    const asistencia = await AsistenciaDocente.findByPk(id_asistencia);
    if (!asistencia) {
      res.status(404).json({ error: { message: 'Registro de asistencia no encontrado' } });
      return;
    }

    // Create justification and update attendance status atomically
    const result = await sequelize.transaction(async (t) => {
      const justificacion = await Justificacion.create(
        {
          id_asistencia,
          motivo: motivo.trim(),
          soporte_digital: soporte_digital?.trim() || null,
        },
        { transaction: t }
      );

      // Update the attendance record status to 'Justificado'
      await asistencia.update({ estatus: 'Justificado' }, { transaction: t });

      return justificacion;
    });

    broadcastJustificacionEvent({ tipo: 'create', data: result });
    res.status(201).json({ data: result });
  }),

  actualizar: wrapAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const record = await Justificacion.findByPk(id);
    if (!record) {
      res.status(404).json({ error: { message: 'Recurso no encontrado' } });
      return;
    }

    const payload: any = {};
    if (req.body.motivo !== undefined) payload.motivo = req.body.motivo;
    if (req.body.soporte_digital !== undefined) payload.soporte_digital = req.body.soporte_digital;

    await record.update(payload);
    res.json({ data: record });
  }),

  eliminar: wrapAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const record = await Justificacion.findByPk(id);
    if (!record) {
      res.status(404).json({ error: { message: 'Recurso no encontrado' } });
      return;
    }

    // When deleting justification, revert attendance status back to 'Ausente'
    await sequelize.transaction(async (t) => {
      const asistencia = await AsistenciaDocente.findByPk(record.id_asistencia, { transaction: t });
      if (asistencia && asistencia.estatus === 'Justificado') {
        await asistencia.update({ estatus: 'Ausente' }, { transaction: t });
      }
      await record.destroy({ transaction: t });
    });

    broadcastJustificacionEvent({ tipo: 'delete', data: record });
    res.status(204).send();
  }),
};
