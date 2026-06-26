import { Request, Response } from 'express';
import { Estudiante } from '../models/Estudiante';
import { wrapAsync } from '../shared/utils/wrapAsync';

const ALLOWED_CREATE_FIELDS = ['cedula_escolar', 'nombre1', 'nombre2', 'apellido1', 'apellido2', 'fecha_nac', 'lugar_nac', 'municipio', 'estado', 'genero', 'id_representante'];
const ALLOWED_UPDATE_FIELDS = ['cedula_escolar', 'nombre1', 'nombre2', 'apellido1', 'apellido2', 'fecha_nac', 'lugar_nac', 'municipio', 'estado', 'genero'];

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
    res.status(201).json({ data: result });
  }),

  actualizar: wrapAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const record = await Estudiante.findByPk(id);
    if (!record) {
      res.status(404).json({ error: { message: 'Recurso no encontrado' } });
      return;
    }
    await record.update(pick(req.body, ALLOWED_UPDATE_FIELDS));
    res.json({ data: record });
  }),

  eliminar: wrapAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const record = await Estudiante.findByPk(id);
    if (!record) {
      res.status(404).json({ error: { message: 'Recurso no encontrado' } });
      return;
    }
    await record.destroy();
    res.status(204).send();
  }),
};
