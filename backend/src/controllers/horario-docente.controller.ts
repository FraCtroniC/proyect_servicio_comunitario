import { Request, Response } from 'express';
import { HorarioDocente, Asignatura, Seccion, DiaSemana, BloqueHorario, Aula } from '../models';
import { wrapAsync } from '../shared/utils/wrapAsync';

export const HorarioDocenteController = {
  listar: wrapAsync(async (req: Request, res: Response) => {
    const where: any = {};
    if (req.query.id_docente) where.id_docente = Number(req.query.id_docente);

    const result = await HorarioDocente.findAll({
      where,
      include: [
        { model: Asignatura, as: 'asignatura' },
        { model: Seccion, as: 'seccion' },
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
    const result = await HorarioDocente.create(req.body);
    res.status(201).json({ data: result });
  }),

  actualizar: wrapAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const record = await HorarioDocente.findByPk(id);
    if (!record) {
      res.status(404).json({ error: { message: 'Recurso no encontrado' } });
      return;
    }
    await record.update(req.body);
    res.json({ data: record });
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
  }),
};
