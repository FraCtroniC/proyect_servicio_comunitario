import { Request, Response } from 'express';
import { Aula } from '../models/Aula';
import { wrapAsync } from '../shared/utils/wrapAsync';
import { Op } from 'sequelize';

export const AulaController = {
  listar: wrapAsync(async (_req: Request, res: Response) => {
    const result = await Aula.findAll();
    res.json({ data: result });
  }),

  obtenerPorId: wrapAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const result = await Aula.findByPk(id);
    if (!result) {
      res.status(404).json({ error: { message: 'Recurso no encontrado' } });
      return;
    }
    res.json({ data: result });
  }),

  crear: wrapAsync(async (req: Request, res: Response) => {
    const { nombre_codigo, capacidad } = req.body;
    if (capacidad !== undefined && capacidad > 34) {
      res.status(400).json({ error: { message: 'La capacidad (aforo) del aula no puede ser mayor a 34 estudiantes según las normativas.' } });
      return;
    }
    if (nombre_codigo) {
      const existente = await Aula.findOne({
        where: { nombre_codigo: { [Op.iLike]: nombre_codigo } }
      });
      if (existente) {
        res.status(400).json({ error: { message: 'El nombre del aula ya está registrado', details: { nombre_codigo: ['El nombre del aula ya está registrado'] } } });
        return;
      }
    }
    const result = await Aula.create(req.body);
    res.status(201).json({ data: result });
  }),

  actualizar: wrapAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { nombre_codigo, capacidad } = req.body;
    const record = await Aula.findByPk(id);
    if (!record) {
      res.status(404).json({ error: { message: 'Recurso no encontrado' } });
      return;
    }
    if (capacidad !== undefined && capacidad > 34) {
      res.status(400).json({ error: { message: 'La capacidad (aforo) del aula no puede ser mayor a 34 estudiantes según las normativas.' } });
      return;
    }
    if (nombre_codigo) {
      const existente = await Aula.findOne({
        where: {
          nombre_codigo: { [Op.iLike]: nombre_codigo },
          id_aula: { [Op.ne]: id }
        }
      });
      if (existente) {
        res.status(400).json({ error: { message: 'El nombre del aula ya está registrado', details: { nombre_codigo: ['El nombre del aula ya está registrado'] } } });
        return;
      }
    }
    await record.update(req.body);
    res.json({ data: record });
  }),

  eliminar: wrapAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const record = await Aula.findByPk(id);
    if (!record) {
      res.status(404).json({ error: { message: 'Recurso no encontrado' } });
      return;
    }
    await record.destroy();
    res.status(204).send();
  }),
};
