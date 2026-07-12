import { Request, Response } from 'express';
import { HorarioDocente, Asignatura, Seccion, GradoAno, DiaSemana, BloqueHorario, Aula } from '../models';
import { wrapAsync } from '../shared/utils/wrapAsync';
import { broadcastHorarioEvent } from './horario-stream.controller';

export const HorarioDocenteController = {
  listar: wrapAsync(async (req: Request, res: Response) => {
    const where: any = {};
    if (req.query.id_docente) where.id_docente = Number(req.query.id_docente);

    const result = await HorarioDocente.findAll({
      where,
      include: [
        { model: Asignatura, as: 'asignatura' },
        { model: Seccion, as: 'seccion', include: [{ model: GradoAno, as: 'grado' }] },
        { model: DiaSemana, as: 'dia' },
        { model: BloqueHorario, as: 'bloque' },
        { model: Aula, as: 'aula' }
      ]
    });
    res.json({ data: result });
  }),

  obtenerPorId: wrapAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const result = await HorarioDocente.findByPk(id);
    if (!result) {
      res.status(404).json({ error: { message: 'Recurso no encontrado' } });
      return;
    }
    res.json({ data: result });
  }),

  crear: wrapAsync(async (req: Request, res: Response) => {
    const { id_dia, id_bloque, ...resto } = req.body;

    const result = await HorarioDocente.create({ ...resto, id_dia, id_bloque });

    res.status(201).json({ data: result });

    const completo = await HorarioDocente.findByPk(result.get('id_horario'), {
      include: [
        { model: Asignatura, as: 'asignatura' },
        { model: Seccion, as: 'seccion', include: [{ model: GradoAno, as: 'grado' }] },
        { model: DiaSemana, as: 'dia' },
        { model: BloqueHorario, as: 'bloque' },
        { model: Aula, as: 'aula' }
      ]
    });
    broadcastHorarioEvent({ tipo: 'create', data: completo });
  }),

  actualizar: wrapAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const record = await HorarioDocente.findByPk(id);
    if (!record) {
      res.status(404).json({ error: { message: 'Recurso no encontrado' } });
      return;
    }
    
    const { id_dia, id_bloque, ...resto } = req.body;

    await record.update({ ...resto, id_dia, id_bloque });

    res.json({ data: record });

    const completo = await HorarioDocente.findByPk(id, {
      include: [
        { model: Asignatura, as: 'asignatura' },
        { model: Seccion, as: 'seccion', include: [{ model: GradoAno, as: 'grado' }] },
        { model: DiaSemana, as: 'dia' },
        { model: BloqueHorario, as: 'bloque' },
        { model: Aula, as: 'aula' }
      ]
    });
    broadcastHorarioEvent({ tipo: 'update', data: completo });
  }),

  eliminar: wrapAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const record = await HorarioDocente.findByPk(id);
    if (!record) {
      res.status(404).json({ error: { message: 'Recurso no encontrado' } });
      return;
    }
    await record.destroy();
    res.status(204).send();
    broadcastHorarioEvent({ tipo: 'delete', data: { id_horario: id } });
  }),
};
