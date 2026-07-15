import { Request, Response } from 'express';
import { Seccion, GradoAno, PeriodoEscolar, Docente, Aula } from '../models';
import { wrapAsync } from '../shared/utils/wrapAsync';
import { getIO } from '../socket';

const includes = [
  { model: GradoAno, as: 'grado' },
  { model: PeriodoEscolar, as: 'periodo' },
  { model: Docente, as: 'docenteGuia' },
  { model: Aula, as: 'aula' },
];

export const SeccionController = {
  listar: wrapAsync(async (req: Request, res: Response) => {
    const where: any = {};
    if (req.query.id_periodo) {
      where.id_periodo = Number(req.query.id_periodo);
    }
    const result = await Seccion.findAll({ where, include: includes });
    res.json({ data: result });
  }),

  obtenerPorId: wrapAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const result = await Seccion.findByPk(id, { include: includes });
    if (!result) {
      res.status(404).json({ error: { message: 'Recurso no encontrado' } });
      return;
    }
    res.json({ data: result });
  }),

  crear: wrapAsync(async (req: Request, res: Response) => {
    const result = await Seccion.create(req.body);

    const completo = await Seccion.findByPk(result.get('id_seccion'), { include: includes });
    getIO().emit('seccion:create', { data: completo });
    res.status(201).json({ data: completo });
  }),

  actualizar: wrapAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const record = await Seccion.findByPk(id);
    if (!record) {
      res.status(404).json({ error: { message: 'Recurso no encontrado' } });
      return;
    }
    await record.update(req.body);

    const completo = await Seccion.findByPk(id, { include: includes });
    getIO().emit('seccion:update', { data: completo });
    res.json({ data: completo });
  }),

  eliminar: wrapAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const record = await Seccion.findByPk(id);
    if (!record) {
      res.status(404).json({ error: { message: 'Recurso no encontrado' } });
      return;
    }
    await record.destroy();
    getIO().emit('seccion:delete', { data: { id_seccion: id } });
    res.status(204).send();
  }),
};
