import { Request, Response } from 'express';
import { Auditoria, Usuario } from '../models';
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
    const { accion, tabla_afectada, id_usuario } = req.body;
    if (!accion || !tabla_afectada) {
      res.status(400).json({ error: { message: 'Los campos accion y tabla_afectada son requeridos' } });
      return;
    }

    let finalIdUsuario = id_usuario;
    if (finalIdUsuario !== null && finalIdUsuario !== undefined) {
      const userExists = await Usuario.findByPk(finalIdUsuario);
      if (!userExists) {
        // Fallback to first available user
        const firstUser = await Usuario.findOne();
        finalIdUsuario = firstUser ? firstUser.id_usuario : null;
      }
    }

    const payload = { ...req.body, id_usuario: finalIdUsuario };
    const result = await Auditoria.create(payload);
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
