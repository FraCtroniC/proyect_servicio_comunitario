import { Request, Response } from 'express';
import { HorarioDocente, Asignatura, Seccion, GradoAno, DiaSemana, BloqueHorario, Aula, PeriodoEscolar } from '../models';
import { wrapAsync } from '../shared/utils/wrapAsync';
import { getIO } from '../socket';

export const HorarioDocenteController = {
  listar: wrapAsync(async (req: Request, res: Response) => {
    const where: any = {};
    if (req.query.id_docente) where.id_docente = Number(req.query.id_docente);

    if (req.query.id_periodo) {
      where.id_periodo = Number(req.query.id_periodo);
    } else {
      const periodoActivo = await PeriodoEscolar.findOne({ where: { estatus: 'Activo' } });
      if (periodoActivo) {
        where.id_periodo = periodoActivo.id_periodo;
      }
    }

    const result = await HorarioDocente.findAll({
      where,
      include: [
        { model: Asignatura, as: 'asignatura' },
        { model: Seccion, as: 'seccion', include: [{ model: GradoAno, as: 'grado' }] },
        { model: DiaSemana, as: 'dia' },
        { model: BloqueHorario, as: 'bloque' },
        { model: Aula, as: 'aula' },
        { model: PeriodoEscolar, as: 'periodo' }
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
    const { id_dia, id_bloque, id_periodo, ...resto } = req.body;

    let periodoId = id_periodo;
    if (!periodoId) {
      const periodoActivo = await PeriodoEscolar.findOne({ where: { estatus: 'Activo' } });
      periodoId = periodoActivo?.id_periodo || null;
    }

    const created = await HorarioDocente.create({ ...resto, id_dia, id_bloque, id_periodo: periodoId });

    const result = await HorarioDocente.findByPk(created.id_horario, {
      include: [
        { model: Asignatura, as: 'asignatura' },
        { model: Seccion, as: 'seccion', include: [{ model: GradoAno, as: 'grado' }] },
        { model: DiaSemana, as: 'dia' },
        { model: BloqueHorario, as: 'bloque' },
        { model: Aula, as: 'aula' },
        { model: PeriodoEscolar, as: 'periodo' }
      ]
    });

    getIO().emit('horario:create', { data: result });
    res.status(201).json({ data: result });

  }),

  actualizar: wrapAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const record = await HorarioDocente.findByPk(id);
    if (!record) {
      res.status(404).json({ error: { message: 'Recurso no encontrado' } });
      return;
    }
    
    const { id_dia, id_bloque, ...resto } = req.body;

    await record.update({ ...resto, id_dia, id_bloque });

    const result = await HorarioDocente.findByPk(id, {
      include: [
        { model: Asignatura, as: 'asignatura' },
        { model: Seccion, as: 'seccion', include: [{ model: GradoAno, as: 'grado' }] },
        { model: DiaSemana, as: 'dia' },
        { model: BloqueHorario, as: 'bloque' },
        { model: Aula, as: 'aula' },
        { model: PeriodoEscolar, as: 'periodo' }
      ]
    });

    getIO().emit('horario:update', { data: result });
    res.json({ data: result });

  }),

  eliminar: wrapAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const record = await HorarioDocente.findByPk(id);
    if (!record) {
      res.status(404).json({ error: { message: 'Recurso no encontrado' } });
      return;
    }
    await record.destroy();
    getIO().emit('horario:delete', { data: { id_horario: id } });
    res.status(204).send();
  }),
};
