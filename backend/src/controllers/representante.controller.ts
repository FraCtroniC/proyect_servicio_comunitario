import { Request, Response } from 'express';
import { Representante } from '../models';
import { wrapAsync } from '../shared/utils/wrapAsync';
import { getIO } from '../socket';

const ALLOWED_REP_FIELDS = [
  'cedula_rep', 'nombre1', 'nombre2', 'apellido1', 'apellido2',
  'correo', 'telefono', 'direccion',
];

function pick(body: any, fields: string[]): any {
  const result: any = {};
  for (const field of fields) {
    if (body[field] !== undefined) result[field] = body[field];
  }
  return result;
}

export const RepresentanteController = {
  listar: wrapAsync(async (_req: Request, res: Response) => {
    const result = await Representante.findAll();
    res.json({ data: result });
  }),

  obtenerPorId: wrapAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const result = await Representante.findByPk(id);
    if (!result) {
      res.status(404).json({ error: { message: 'Recurso no encontrado' } });
      return;
    }
    res.json({ data: result });
  }),

  crear: wrapAsync(async (req: Request, res: Response) => {
    const now = new Date();
    const result = await Representante.create({
      ...pick(req.body, ALLOWED_REP_FIELDS),
      created_at: now,
      updated_at: now,
    });
    const completo = await Representante.findByPk(result.get('id_representante') as number);
    getIO().emit('representante:create', { data: completo });
    res.status(201).json({ data: completo });
  }),

  actualizar: wrapAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const record = await Representante.findByPk(id);
    if (!record) {
      res.status(404).json({ error: { message: 'Recurso no encontrado' } });
      return;
    }
    await record.update(pick(req.body, ALLOWED_REP_FIELDS));
    const completo = await Representante.findByPk(id);
    getIO().emit('representante:update', { data: completo });
    res.json({ data: completo });
  }),

  eliminar: wrapAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const record = await Representante.findByPk(id);
    if (!record) {
      res.status(404).json({ error: { message: 'Recurso no encontrado' } });
      return;
    }
    await record.destroy();
    getIO().emit('representante:delete', { data: { id_representante: id } });
    res.status(204).send();
  }),
};
