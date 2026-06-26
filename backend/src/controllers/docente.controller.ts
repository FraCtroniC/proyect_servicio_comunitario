import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Docente } from '../models/Docente';
import { wrapAsync } from '../shared/utils/wrapAsync';
import { NotFoundError } from '../shared/errors';

const ALLOWED_CREATE_FIELDS = ['cedula_docente', 'nombre1', 'nombre2', 'apellido1', 'apellido2', 'especialidad', 'telefono', 'correo'];
const ALLOWED_UPDATE_FIELDS = ['cedula_docente', 'nombre1', 'nombre2', 'apellido1', 'apellido2', 'especialidad', 'telefono', 'correo'];

function pick(body: any, fields: string[]): any {
  const result: any = {};
  for (const field of fields) {
    if (body[field] !== undefined) result[field] = body[field];
  }
  return result;
}

export const DocenteController = {
  listar: wrapAsync(async (_req: Request, res: Response) => {
    const result = await Docente.findAll();
    res.json({ data: result });
  }),

  obtenerPorId: wrapAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const result = await Docente.findByPk(id);
    if (!result) {
      res.status(404).json({ error: { message: 'Recurso no encontrado' } });
      return;
    }
    res.json({ data: result });
  }),

  crear: wrapAsync(async (req: Request, res: Response) => {
    const result = await Docente.create(pick(req.body, ALLOWED_CREATE_FIELDS));
    res.status(201).json({ data: result });
  }),

  actualizar: wrapAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const record = await Docente.findByPk(id);
    if (!record) {
      res.status(404).json({ error: { message: 'Recurso no encontrado' } });
      return;
    }
    await record.update(pick(req.body, ALLOWED_UPDATE_FIELDS));
    res.json({ data: record });
  }),

  eliminar: wrapAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const record = await Docente.findByPk(id);
    if (!record) {
      res.status(404).json({ error: { message: 'Recurso no encontrado' } });
      return;
    }
    await record.destroy();
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
