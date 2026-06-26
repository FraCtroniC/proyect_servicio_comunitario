import { Request, Response } from 'express';
import { Matricula, Estudiante } from '../models';
import { wrapAsync } from '../shared/utils/wrapAsync';

const ALLOWED_CREATE_FIELDS = ['id_estudiante', 'id_seccion', 'id_periodo', 'numero_lista'];
const ALLOWED_UPDATE_FIELDS = ['numero_lista'];

function pick(body: any, fields: string[]): any {
  const result: any = {};
  for (const field of fields) {
    if (body[field] !== undefined) result[field] = body[field];
  }
  return result;
}

export const MatriculaController = {
  listar: wrapAsync(async (req: Request, res: Response) => {
    const where: any = {};
    if (req.query.id_seccion) where.id_seccion = Number(req.query.id_seccion);
    if (req.query.id_periodo) where.id_periodo = Number(req.query.id_periodo);

    const result = await Matricula.findAll({
      where,
      include: [{ model: Estudiante, as: 'estudiante' }]
    });
    res.json({ data: result });
  }),

  obtenerPorId: wrapAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const result = await Matricula.findByPk(id);
    if (!result) {
      res.status(404).json({ error: { message: 'Recurso no encontrado' } });
      return;
    }
    res.json({ data: result });
  }),

  crear: wrapAsync(async (req: Request, res: Response) => {
    const result = await Matricula.create(pick(req.body, ALLOWED_CREATE_FIELDS));
    res.status(201).json({ data: result });
  }),

  actualizar: wrapAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const record = await Matricula.findByPk(id);
    if (!record) {
      res.status(404).json({ error: { message: 'Recurso no encontrado' } });
      return;
    }
    await record.update(pick(req.body, ALLOWED_UPDATE_FIELDS));
    res.json({ data: record });
  }),

  eliminar: wrapAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const record = await Matricula.findByPk(id);
    if (!record) {
      res.status(404).json({ error: { message: 'Recurso no encontrado' } });
      return;
    }
    await record.destroy();
    res.status(204).send();
  }),
};
