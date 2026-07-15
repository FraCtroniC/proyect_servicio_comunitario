import { Request, Response } from 'express';
import { BloqueHorario } from '../models/BloqueHorario';
import { wrapAsync } from '../shared/utils/wrapAsync';
import { getIO } from '../socket';

export const BloqueHorarioController = {
  listar: wrapAsync(async (_req: Request, res: Response) => {
    const result = await BloqueHorario.findAll({ order: [['numero_bloque', 'ASC']] });
    res.json({ data: result });
  }),

  obtenerPorId: wrapAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const result = await BloqueHorario.findByPk(id);
    if (!result) {
      res.status(404).json({ error: { message: 'Recurso no encontrado' } });
      return;
    }
    res.json({ data: result });
  }),

  crear: wrapAsync(async (req: Request, res: Response) => {
    const result = await BloqueHorario.create(req.body);
    getIO().emit('bloque:create', { data: result });
    res.status(201).json({ data: result });
  }),

  actualizar: wrapAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const record = await BloqueHorario.findByPk(id);
    if (!record) {
      res.status(404).json({ error: { message: 'Recurso no encontrado' } });
      return;
    }
    await record.update(req.body);
    getIO().emit('bloque:update', { data: record });
    res.json({ data: record });
  }),

  eliminar: wrapAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const record = await BloqueHorario.findByPk(id);
    if (!record) {
      res.status(404).json({ error: { message: 'Recurso no encontrado' } });
      return;
    }
    await record.destroy();
    getIO().emit('bloque:delete', { data: { id_bloque: id } });
    res.status(204).send();
  }),
};
