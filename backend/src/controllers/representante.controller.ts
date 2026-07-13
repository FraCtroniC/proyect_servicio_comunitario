import { Request, Response } from 'express';
import { Representante } from '../models/Representante';
import { wrapAsync } from '../shared/utils/wrapAsync';
import { broadcastRepresentanteEvent } from './representante-stream.controller';

export const RepresentanteController = {
  listar: wrapAsync(async (_req: Request, res: Response) => {
    const result = await Representante.findAll();
    res.json({ data: result });
  }),

  obtenerPorId: wrapAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const result = await Representante.findByPk(id);
    if (!result) {
      res.status(404).json({ error: { message: 'Recurso no encontrado' } });
      return;
    }
    res.json({ data: result });
  }),

  crear: wrapAsync(async (req: Request, res: Response) => {
    const result = await Representante.create(req.body);
    res.status(201).json({ data: result });
    broadcastRepresentanteEvent({ tipo: 'create', data: result });
  }),

  actualizar: wrapAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const record = await Representante.findByPk(id);
    if (!record) {
      res.status(404).json({ error: { message: 'Recurso no encontrado' } });
      return;
    }
    await record.update(req.body);
    res.json({ data: record });
    broadcastRepresentanteEvent({ tipo: 'update', data: record });
  }),

  eliminar: wrapAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const record = await Representante.findByPk(id);
    if (!record) {
      res.status(404).json({ error: { message: 'Recurso no encontrado' } });
      return;
    }
    await record.destroy();
    res.status(204).send();
    broadcastRepresentanteEvent({ tipo: 'delete', data: record });
  }),
};
