import { Request, Response } from 'express';
import { HorarioDocente, Asignatura, Seccion, DiaSemana, BloqueHorario, Aula } from '../models';
import { wrapAsync } from '../shared/utils/wrapAsync';

export const HorarioDocenteController = {
  listar: wrapAsync(async (req: Request, res: Response) => {
    const where: any = {};
    if (req.query.id_docente) where.id_docente = Number(req.query.id_docente);

    const result = await HorarioDocente.findAll({
      where,
      include: [
        { model: Asignatura, as: 'asignatura' },
        { model: Seccion, as: 'seccion' },
        { model: DiaSemana, as: 'dia' },
        { model: BloqueHorario, as: 'bloque' },
        { model: Aula, as: 'aula' }
      ]
    });
    res.json({ data: result });
  }),

  obtenerPorId: wrapAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const result = await HorarioDocente.findByPk(id);
    if (!result) {
      res.status(404).json({ error: { message: 'Recurso no encontrado' } });
      return;
    }
    res.json({ data: result });
  }),

  crear: wrapAsync(async (req: Request, res: Response) => {
    let { id_dia, id_bloque, dia_nombre, bloque_rango, ...resto } = req.body;
    
    if (dia_nombre) {
      const [dia] = await DiaSemana.findOrCreate({
        where: { nombre: dia_nombre },
        defaults: { nombre: dia_nombre }
      });
      id_dia = dia.get('id_dia');
    }

    if (bloque_rango) {
      const [hora_inicio, hora_fin] = bloque_rango.split(' - ').map((h: string) => h.trim() + ':00');
      const [bloque] = await BloqueHorario.findOrCreate({
        where: { hora_inicio },
        defaults: { hora_inicio, hora_fin: hora_fin || hora_inicio, tipo_bloque: 'Clase', numero_bloque: 1 }
      });
      id_bloque = bloque.get('id_bloque');
    }

    const result = await HorarioDocente.create({ ...resto, id_dia, id_bloque });
    res.status(201).json({ data: result });
  }),

  actualizar: wrapAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const record = await HorarioDocente.findByPk(id);
    if (!record) {
      res.status(404).json({ error: { message: 'Recurso no encontrado' } });
      return;
    }
    
    let { id_dia, id_bloque, dia_nombre, bloque_rango, ...resto } = req.body;
    
    if (dia_nombre) {
      const [dia] = await DiaSemana.findOrCreate({
        where: { nombre: dia_nombre },
        defaults: { nombre: dia_nombre }
      });
      id_dia = dia.get('id_dia');
    }

    if (bloque_rango) {
      const [hora_inicio, hora_fin] = bloque_rango.split(' - ').map((h: string) => h.trim() + (h.split(':').length === 2 ? ':00' : ''));
      const [bloque] = await BloqueHorario.findOrCreate({
        where: { hora_inicio },
        defaults: { hora_inicio, hora_fin: hora_fin || hora_inicio, tipo_bloque: 'Clase', numero_bloque: 1 }
      });
      id_bloque = bloque.get('id_bloque');
    }

    await record.update({ ...resto, id_dia, id_bloque });
    res.json({ data: record });
  }),

  eliminar: wrapAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const record = await HorarioDocente.findByPk(id);
    if (!record) {
      res.status(404).json({ error: { message: 'Recurso no encontrado' } });
      return;
    }
    await record.destroy();
    res.status(204).send();
  }),
};
