import { Request, Response } from 'express';
import { Auditoria } from '../models/Auditoria';
import { wrapAsync } from '../shared/utils/wrapAsync';

export const AuditoriaController = {
  listar: wrapAsync(async (_req: Request, res: Response) => {
    const result = await Auditoria.findAll();
    res.json({ data: result });
  }),

  obtenerPorId: wrapAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const result = await Auditoria.findByPk(id);
    if (!result) {
      res.status(404).json({ error: { message: 'Recurso no encontrado' } });
      return;
    }
    res.json({ data: result });
  }),

  crear: wrapAsync(async (req: Request, res: Response) => {
    const { accion, tabla_afectada } = req.body;
    if (!accion || !tabla_afectada) {
      res.status(400).json({ error: { message: 'Los campos accion y tabla_afectada son requeridos' } });
      return;
    }
    const result = await Auditoria.create(req.body);
    res.status(201).json({ data: result });
  }),

  actualizar: wrapAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const record = await Auditoria.findByPk(id);
    if (!record) {
      res.status(404).json({ error: { message: 'Recurso no encontrado' } });
      return;
    }
    await record.update(req.body);
    res.json({ data: record });
  }),

  eliminar: wrapAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const record = await Auditoria.findByPk(id);
    if (!record) {
      res.status(404).json({ error: { message: 'Recurso no encontrado' } });
      return;
    }
    await record.destroy();
    res.status(204).send();
  }),
};
