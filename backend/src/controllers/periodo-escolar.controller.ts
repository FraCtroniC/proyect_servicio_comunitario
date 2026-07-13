import { Request, Response } from 'express';
import { PeriodoEscolar } from '../models/PeriodoEscolar';
import { wrapAsync } from '../shared/utils/wrapAsync';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

export const PeriodoEscolarController = {
  listar: wrapAsync(async (_req: Request, res: Response) => {
    const result = await PeriodoEscolar.findAll();
    res.json({ data: result });
  }),

  obtenerPorId: wrapAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const result = await PeriodoEscolar.findByPk(id);
    if (!result) {
      res.status(404).json({ error: { message: 'Recurso no encontrado' } });
      return;
    }
    res.json({ data: result });
  }),

  crear: wrapAsync(async (req: Request, res: Response) => {
    const { nombre, estatus } = req.body;
    if (nombre) {
      const existing = await PeriodoEscolar.findOne({ where: { nombre } });
      if (existing) {
        res.status(400).json({ error: { message: `Ya existe un período escolar registrado con el nombre ${nombre}` } });
        return;
      }
    }
    if (estatus === 'Activo') {
      const activoExistente = await PeriodoEscolar.findOne({ where: { estatus: 'Activo' } });
      if (activoExistente) {
        res.status(400).json({ error: { message: `Ya existe un período escolar activo (${activoExistente.nombre}). Debe cerrarlo antes de activar uno nuevo.` } });
        return;
      }
    }
    const result = await PeriodoEscolar.create(req.body);
    res.status(201).json({ data: result });
  }),

  actualizar: wrapAsync(async (req: AuthenticatedRequest, res: Response) => {
    const id = Number(req.params.id);
    const { nombre, estatus } = req.body;
    const record = await PeriodoEscolar.findByPk(id);
    if (!record) {
      res.status(404).json({ error: { message: 'Recurso no encontrado' } });
      return;
    }
    if (nombre && nombre !== record.nombre) {
      const existing = await PeriodoEscolar.findOne({ where: { nombre } });
      if (existing) {
        res.status(400).json({ error: { message: `Ya existe un período escolar registrado con el nombre ${nombre}` } });
        return;
      }
    }
    if (estatus === 'Activo' && record.estatus === 'Cerrado') {
      if (req.user?.idRol !== 1 && req.user?.rol !== 'Administrador') {
        res.status(403).json({ error: { message: 'Solo el administrador puede reactivar un período cerrado' } });
        return;
      }
    }
    if (estatus === 'Activo' && record.estatus !== 'Activo') {
      const activoExistente = await PeriodoEscolar.findOne({ where: { estatus: 'Activo' } });
      if (activoExistente) {
        res.status(400).json({ error: { message: `Ya existe un período escolar activo (${activoExistente.nombre}). Debe cerrarlo antes de activar uno nuevo.` } });
        return;
      }
    }
    await record.update(req.body);
    res.json({ data: record });
  }),

  eliminar: wrapAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const record = await PeriodoEscolar.findByPk(id);
    if (!record) {
      res.status(404).json({ error: { message: 'Recurso no encontrado' } });
      return;
    }
    await record.destroy();
    res.status(204).send();
  }),
};
