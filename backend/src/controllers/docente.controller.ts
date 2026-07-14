import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { DocenteService } from '../services/docente.service';
import { Docente } from '../models';
import { wrapAsync } from '../shared/utils/wrapAsync';
import { NotFoundError } from '../shared/errors';
import { getIO } from '../socket';

export const DocenteController = {
  listar: wrapAsync(async (_req: Request, res: Response) => {
    const result = await DocenteService.listar();
    res.json({ data: result });
  }),

  obtenerPorId: wrapAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const result = await DocenteService.obtenerPorId(id);
    res.json({ data: result });
  }),

  crear: wrapAsync(async (req: Request, res: Response) => {
    const result = await DocenteService.crear(req.body);
    if (result.usuario) {
      getIO().emit('usuario:create', { data: { id: result.usuario.idUsuario, ...result.usuario } });
    }
    res.status(201).json({ data: result });
  }),

  actualizar: wrapAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const result = await DocenteService.actualizar(id, req.body);
    res.json({ data: result });
  }),

  eliminar: wrapAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    await DocenteService.eliminar(id);
    res.status(204).send();
  }),

  generarQR: wrapAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const docente = await Docente.findByPk(id);
    if (!docente) {
      throw new NotFoundError('Docente no encontrado');
    }
    docente.token_qr = uuidv4();
    await docente.save();
    res.json({ data: { token_qr: docente.token_qr } });
  }),
};
