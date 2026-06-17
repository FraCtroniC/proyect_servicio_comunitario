import { Request, Response } from 'express';
import { Calificacion } from '../models';
import { wrapAsync } from '../shared/utils/wrapAsync';

export const CalificacionController = {
  listar: wrapAsync(async (req: Request, res: Response) => {
    const where: any = {};
    if (req.query.id_plan) where.id_plan = Number(req.query.id_plan);
    if (req.query.id_momento) where.id_momento = Number(req.query.id_momento);
    if (req.query.id_matricula) where.id_matricula = Number(req.query.id_matricula);

    const result = await Calificacion.findAll({ where });
    res.json({ data: result });
  }),

  bulkUpsert: wrapAsync(async (req: Request, res: Response) => {
    const { calificaciones } = req.body;
    if (!Array.isArray(calificaciones)) {
      res.status(400).json({ error: { message: 'Calificaciones debe ser un arreglo' } });
      return;
    }

    const savedRecords = [];
    for (const item of calificaciones) {
      const { id_matricula, id_plan, id_momento, id_escala, inasistencias_asignatura } = item;
      const [record, created] = await Calificacion.findOrCreate({
        where: { id_matricula, id_plan, id_momento },
        defaults: { id_escala, inasistencias_asignatura: inasistencias_asignatura ?? 0 }
      });

      if (!created) {
        await record.update({ id_escala, inasistencias_asignatura: inasistencias_asignatura ?? 0 });
      }
      savedRecords.push(record);
    }

    res.json({ data: savedRecords });
  }),

  obtenerPorId: wrapAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const result = await Calificacion.findByPk(id);
    if (!result) {
      res.status(404).json({ error: { message: 'Recurso no encontrado' } });
      return;
    }
    res.json({ data: result });
  }),

  crear: wrapAsync(async (req: Request, res: Response) => {
    const result = await Calificacion.create(req.body);
    res.status(201).json({ data: result });
  }),

  actualizar: wrapAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const record = await Calificacion.findByPk(id);
    if (!record) {
      res.status(404).json({ error: { message: 'Recurso no encontrado' } });
      return;
    }
    await record.update(req.body);
    res.json({ data: record });
  }),

  eliminar: wrapAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const record = await Calificacion.findByPk(id);
    if (!record) {
      res.status(404).json({ error: { message: 'Recurso no encontrado' } });
      return;
    }
    await record.destroy();
    res.status(204).send();
  }),
};
