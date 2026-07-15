import { Request, Response } from 'express';
import { Estudiante } from '../models/Estudiante';
import { wrapAsync } from '../shared/utils/wrapAsync';
import { getIO } from '../socket';

const ALLOWED_CREATE_FIELDS = ['cedula_escolar', 'nombre1', 'nombre2', 'apellido1', 'apellido2', 'fecha_nac', 'lugar_nac', 'municipio', 'estado', 'genero', 'id_representante', 'estatus_estudiante'];
const ALLOWED_UPDATE_FIELDS = ['cedula_escolar', 'nombre1', 'nombre2', 'apellido1', 'apellido2', 'fecha_nac', 'lugar_nac', 'municipio', 'estado', 'genero', 'estatus_estudiante'];

function pick(body: any, fields: string[]): any {
  const result: any = {};
  for (const field of fields) {
    if (body[field] !== undefined) result[field] = body[field];
  }
  return result;
}

export const EstudianteController = {
  listar: wrapAsync(async (_req: Request, res: Response) => {
    const result = await Estudiante.findAll({
      include: ['representante']
    });
    res.json({ data: result });
  }),

  obtenerPorId: wrapAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const result = await Estudiante.findByPk(id);
    if (!result) {
      res.status(404).json({ error: { message: 'Recurso no encontrado' } });
      return;
    }
    res.json({ data: result });
  }),

  crear: wrapAsync(async (req: Request, res: Response) => {
    const result = await Estudiante.create(pick(req.body, ALLOWED_CREATE_FIELDS));
    const completo = await Estudiante.findByPk(result.get('id_estudiante'), { include: ['representante'] });
    getIO().emit('estudiante:create', { data: completo });
    res.status(201).json({ data: completo });
  }),

  actualizar: wrapAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const record = await Estudiante.findByPk(id);
    if (!record) {
      res.status(404).json({ error: { message: 'Recurso no encontrado' } });
      return;
    }
    await record.update(pick(req.body, ALLOWED_UPDATE_FIELDS));
    const completo = await Estudiante.findByPk(id, { include: ['representante'] });
    getIO().emit('estudiante:update', { data: completo });
    res.json({ data: completo });
  }),

  eliminar: wrapAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const record = await Estudiante.findByPk(id);
    if (!record) {
      res.status(404).json({ error: { message: 'Recurso no encontrado' } });
      return;
    }
    await record.destroy();
    getIO().emit('estudiante:delete', { data: { id_estudiante: id } });
    res.status(204).send();
  }),
};
