import { Request, Response } from 'express';
import { DiaSemana } from '../models/DiaSemana';
import { wrapAsync } from '../shared/utils/wrapAsync';
import { getIO } from '../socket';

export const DiaSemanaController = {
  listar: wrapAsync(async (_req: Request, res: Response) => {
    const result = await DiaSemana.findAll({ order: [['id_dia', 'ASC']] });
    res.json({ data: result });
  }),

  obtenerPorId: wrapAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const result = await DiaSemana.findByPk(id);
    if (!result) {
      res.status(404).json({ error: { message: 'Recurso no encontrado' } });
      return;
    }
    res.json({ data: result });
  }),

  crear: wrapAsync(async (req: Request, res: Response) => {
    const result = await DiaSemana.create(req.body);
    getIO().emit('dia:create', { data: result });
    res.status(201).json({ data: result });
  }),

  actualizar: wrapAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const record = await DiaSemana.findByPk(id);
    if (!record) {
      res.status(404).json({ error: { message: 'Recurso no encontrado' } });
      return;
    }
    await record.update(req.body);
    getIO().emit('dia:update', { data: record });
    res.json({ data: record });
  }),

  eliminar: wrapAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const record = await DiaSemana.findByPk(id);
    if (!record) {
      res.status(404).json({ error: { message: 'Recurso no encontrado' } });
      return;
    }
    await record.destroy();
    getIO().emit('dia:delete', { data: { id_dia: id } });
    res.status(204).send();
  }),
};
