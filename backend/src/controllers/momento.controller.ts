import { Request, Response } from 'express';
import { Momento } from '../models/Momento';
import { wrapAsync } from '../shared/utils/wrapAsync';

export const MomentoController = {
  listar: wrapAsync(async (_req: Request, res: Response) => {
    const result = await Momento.findAll();
    res.json({ data: result });
  }),

  obtenerPorId: wrapAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const result = await Momento.findByPk(id);
    if (!result) {
      res.status(404).json({ error: { message: 'Recurso no encontrado' } });
      return;
    }
    res.json({ data: result });
  }),

  crear: wrapAsync(async (req: Request, res: Response) => {
    const result = await Momento.create(req.body);
    res.status(201).json({ data: result });
  }),

  actualizar: wrapAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const record = await Momento.findByPk(id);
    if (!record) {
      res.status(404).json({ error: { message: 'Recurso no encontrado' } });
      return;
    }
    await record.update(req.body);

    const { PeriodoEscolar } = require('../models/PeriodoEscolar');
    const { getIO } = require('../socket');
    const resultWithMomentos = await PeriodoEscolar.findByPk(record.id_periodo, { include: [{ model: Momento, as: 'momentos' }] });
    if (resultWithMomentos) {
      getIO().emit('periodo:update', { data: resultWithMomentos });
    }

    res.json({ data: record });
  }),

  eliminar: wrapAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const record = await Momento.findByPk(id);
    if (!record) {
      res.status(404).json({ error: { message: 'Recurso no encontrado' } });
      return;
    }
    await record.destroy();
    res.status(204).send();
  }),
};
