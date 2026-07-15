import { Request, Response } from 'express';
import { Persona, Estudiante, Representante } from '../models';
import { wrapAsync } from '../shared/utils/wrapAsync';
import { getIO } from '../socket';
import { ValidationError } from '../shared/errors';

const ALLOWED_ESTUDIANTE_FIELDS = ['lugar_nac', 'municipio', 'estado', 'id_representante', 'estatus_estudiante'];

function pick(body: any, fields: string[]): any {
  const result: any = {};
  for (const field of fields) {
    if (body[field] !== undefined) result[field] = body[field];
  }
  return result;
}

function personaPick(body: any): any {
  const fields = ['cedula', 'nombre1', 'nombre2', 'apellido1', 'apellido2', 'fecha_nac', 'genero'];
  const result: any = {};
  for (const field of fields) {
    if (body[field] !== undefined) result[field] = body[field];
  }
  return result;
}

async function findCompleto(id: number) {
  return await Estudiante.findByPk(id, {
    include: [
      { model: Persona, as: 'persona' },
      { model: Representante, as: 'representante' },
    ],
  });
}

export const EstudianteController = {
  listar: wrapAsync(async (_req: Request, res: Response) => {
    const result = await Estudiante.findAll({
      include: [
        { model: Persona, as: 'persona' },
        { model: Representante, as: 'representante' },
      ],
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
    const result = await Estudiante.create({
      id_persona: persona.id_persona,
      ...pick(req.body, ALLOWED_ESTUDIANTE_FIELDS),
      created_at: now,
      updated_at: now,
    });
    const completo = await findCompleto(result.get('id_estudiante') as number);
    getIO().emit('estudiante:create', { data: completo });
    res.status(201).json({ data: completo });
  }),

  actualizar: wrapAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const record = await Estudiante.findByPk(id, {
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
    await record.update(pick(req.body, ALLOWED_ESTUDIANTE_FIELDS));
    const completo = await findCompleto(id);
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
