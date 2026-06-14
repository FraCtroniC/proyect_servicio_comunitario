import { Request, Response } from 'express';
import { UsuarioService } from '../services';
import { wrapAsync } from '../../../shared/utils';

export const UsuarioController = {
  listar: wrapAsync(async (_req: Request, res: Response) => {
    const usuarios = await UsuarioService.listar();
    res.json({ data: usuarios });
  }),

  obtenerPorId: wrapAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const usuario = await UsuarioService.obtenerPorId(id);
    res.json({ data: usuario });
  }),

  crear: wrapAsync(async (req: Request, res: Response) => {
    const usuario = await UsuarioService.crear(req.body);
    res.status(201).json({ data: usuario });
  }),

  actualizar: wrapAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const usuario = await UsuarioService.actualizar(id, req.body);
    res.json({ data: usuario });
  }),

  eliminar: wrapAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    await UsuarioService.eliminar(id);
    res.status(204).send();
  }),
};
