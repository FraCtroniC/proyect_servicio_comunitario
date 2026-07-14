import { Request, Response } from 'express';
import { PlanEstudio } from '../models/PlanEstudio';
import { wrapAsync } from '../shared/utils/wrapAsync';
import { Op } from 'sequelize';
import { getIO } from '../socket';

async function validarPlanEstudio(body: any, excludeId?: number): Promise<Record<string, string[]> | null> {
  const errores: Record<string, string[]> = {};

  if (body.codigo_asignatura) {
    if (body.codigo_asignatura.includes(' ')) {
      errores.codigo_asignatura = [`El código '${body.codigo_asignatura}' no debe contener espacios`];
    } else {
      const existente = await PlanEstudio.findOne({
        where: {
          codigo_asignatura: { [Op.iLike]: body.codigo_asignatura },
          ...(excludeId ? { id_plan: { [Op.ne]: excludeId } } : {})
        }
      });
      if (existente) {
        errores.codigo_asignatura = [`El código '${body.codigo_asignatura}' ya está registrado`];
      }
    }
  }

  if (body.id_asignatura && body.id_grado) {
    const existente = await PlanEstudio.findOne({
      where: {
        id_asignatura: body.id_asignatura,
        id_grado: body.id_grado,
        ...(excludeId ? { id_plan: { [Op.ne]: excludeId } } : {})
      }
    });
    if (existente) {
      errores.id_asignatura = [`Esta materia ya está registrada en el año ${body.id_grado}°`];
    }
  }

  if (body.posicion && body.id_grado) {
    const existente = await PlanEstudio.findOne({
      where: {
        posicion: body.posicion,
        id_grado: body.id_grado,
        ...(excludeId ? { id_plan: { [Op.ne]: excludeId } } : {})
      }
    });
    if (existente) {
      errores.posicion = [`La posición ${body.posicion} ya está ocupada en el año ${body.id_grado}°`];
    }
  }

  return Object.keys(errores).length > 0 ? errores : null;
}

export const PlanEstudioController = {
  listar: wrapAsync(async (_req: Request, res: Response) => {
    const result = await PlanEstudio.findAll({
      include: [
        { association: 'asignatura' },
        { association: 'grado' }
      ]
    });
    res.json({ data: result });
  }),

  obtenerPorId: wrapAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const result = await PlanEstudio.findByPk(id);
    if (!result) {
      res.status(404).json({ error: { message: 'Recurso no encontrado' } });
      return;
    }
    res.json({ data: result });
  }),

  crear: wrapAsync(async (req: Request, res: Response) => {
    const errores = await validarPlanEstudio(req.body);
    if (errores) {
      res.status(400).json({ error: { message: 'Error de validación', details: errores } });
      return;
    }
    const result = await PlanEstudio.create(req.body);
    const full = await PlanEstudio.findByPk(result.id_plan, {
      include: [{ association: 'asignatura' }, { association: 'grado' }]
    });
    getIO().emit('plan-estudio:create', { data: full });
    res.status(201).json({ data: full });
  }),

  actualizar: wrapAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const record = await PlanEstudio.findByPk(id);
    if (!record) {
      res.status(404).json({ error: { message: 'Recurso no encontrado' } });
      return;
    }
    const errores = await validarPlanEstudio(req.body, id);
    if (errores) {
      res.status(400).json({ error: { message: 'Error de validación', details: errores } });
      return;
    }
    await record.update(req.body);
    const full = await PlanEstudio.findByPk(id, {
      include: [{ association: 'asignatura' }, { association: 'grado' }]
    });
    getIO().emit('plan-estudio:update', { data: full });
    res.json({ data: full });
  }),

  eliminar: wrapAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const record = await PlanEstudio.findByPk(id);
    if (!record) {
      res.status(404).json({ error: { message: 'Recurso no encontrado' } });
      return;
    }
    await record.destroy();
    getIO().emit('plan-estudio:delete', { data: { id_plan: id } });
    res.status(204).send();
  }),
};
