import { Request, Response } from 'express';
import { Persona, Representante } from '../models';
import { wrapAsync } from '../shared/utils/wrapAsync';
import { getIO } from '../socket';

function personaPick(body: any): any {
  const fields = ['cedula', 'nombre1', 'nombre2', 'apellido1', 'apellido2', 'telefono', 'correo'];
  const result: any = {};
  for (const field of fields) {
    if (body[field] !== undefined) result[field] = body[field];
  }
  return result;
}

async function findCompleto(id: number) {
  return await Representante.findByPk(id, {
    include: [{ model: Persona, as: 'persona' }],
  });
}

export const RepresentanteController = {
  listar: wrapAsync(async (_req: Request, res: Response) => {
    const result = await Representante.findAll({
      include: [{ model: Persona, as: 'persona' }],
    });
    res.json({ data: result });
  }),

  obtenerPorId: wrapAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const result = await findCompleto(id);
    if (!result) {
      res.status(404).json({ error: { message: 'Recurso no encontrado' } });
      return;
    }
    res.json({ data: result });
  }),

  crear: wrapAsync(async (req: Request, res: Response) => {
    const now = new Date();
    const persona = await Persona.create({
      ...personaPick(req.body),
      created_at: now,
      updated_at: now,
    });
    const result = await Representante.create({
      id_persona: persona.id_persona,
      telefono: req.body.telefono ?? null,
      direccion: req.body.direccion ?? null,
      created_at: now,
      updated_at: now,
    });
    const completo = await findCompleto(result.get('id_representante') as number);
    getIO().emit('representante:create', { data: completo });
    res.status(201).json({ data: completo });
  }),

  actualizar: wrapAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const record = await Representante.findByPk(id, {
      include: [{ model: Persona, as: 'persona' }],
    });
    if (!record) {
      res.status(404).json({ error: { message: 'Recurso no encontrado' } });
      return;
    }
    const personaData = personaPick(req.body);
    const persona = (record as any).persona;
    if (persona && Object.keys(personaData).length > 0) {
      await persona.update(personaData);
    }
    const repUpdate: any = {};
    if (req.body.telefono !== undefined) repUpdate.telefono = req.body.telefono;
    if (req.body.direccion !== undefined) repUpdate.direccion = req.body.direccion;
    if (Object.keys(repUpdate).length > 0) {
      await record.update(repUpdate);
    }
    const completo = await findCompleto(id);
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
