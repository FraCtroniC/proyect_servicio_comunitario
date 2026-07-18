import { Request, Response } from 'express';
import { TipoPlanEstudio } from '../models/TipoPlanEstudio';
import { wrapAsync } from '../shared/utils/wrapAsync';

export const TipoPlanEstudioController = {
  listar: wrapAsync(async (_req: Request, res: Response) => {
    const result = await TipoPlanEstudio.findAll({
      order: [['id_tipo_plan', 'ASC']]
    });
    res.json({ data: result });
  }),
  crear: wrapAsync(async (req: Request, res: Response) => {
    const { nombre } = req.body;
    if (!nombre) {
      return res.status(400).json({ error: { message: 'El nombre del plan de estudio es requerido' } });
    }
    const result = await TipoPlanEstudio.create({ nombre });
    res.status(201).json(result);
  }),
  eliminar: wrapAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const plan = await TipoPlanEstudio.findByPk(id);
    if (!plan) {
      return res.status(404).json({ error: { message: 'Versión del plan no encontrada' } });
    }
    
    try {
      await plan.destroy();
      res.status(204).send();
    } catch (e: any) {
      if (e.name === 'SequelizeForeignKeyConstraintError') {
        return res.status(400).json({ error: { message: 'No se puede eliminar la versión porque tiene materias asignadas.' } });
      }
      throw e;
    }
  }),
};
