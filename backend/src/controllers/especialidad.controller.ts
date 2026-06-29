import { Request, Response } from 'express';
import { Especialidad } from '../models';
import { wrapAsync } from '../shared/utils';

export class EspecialidadController {
  static getAll = wrapAsync(async (req: Request, res: Response) => {
    const especialidades = await Especialidad.findAll({
      order: [['nombre', 'ASC']]
    });
    res.json({ data: especialidades });
  });

  static create = wrapAsync(async (req: Request, res: Response) => {
    const { nombre } = req.body;
    if (!nombre) {
      res.status(400).json({ error: { message: 'El nombre es obligatorio' } });
      return;
    }

    const [especialidad, created] = await Especialidad.findOrCreate({
      where: { nombre: nombre.trim() },
      defaults: { nombre: nombre.trim(), estatus: 'Activa' }
    });

    if (!created) {
      res.status(400).json({ error: { message: 'La especialidad ya existe' } });
      return;
    }

    res.status(201).json({ data: especialidad });
  });
}
