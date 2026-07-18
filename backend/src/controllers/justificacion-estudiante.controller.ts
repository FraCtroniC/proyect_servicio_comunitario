import { Request, Response } from 'express';
import { JustificacionEstudiante, AsistenciaEstudiante, Matricula, Estudiante, Seccion, sequelize } from '../models';
import { wrapAsync } from '../shared/utils/wrapAsync';
import { crearJustificacionEstudianteSchema, actualizarJustificacionSchema } from '../validators/justificacion.schema';

export const JustificacionEstudianteController = {
  listar: wrapAsync(async (_req: Request, res: Response) => {
    const result = await JustificacionEstudiante.findAll({
      include: [
        {
          model: AsistenciaEstudiante,
          as: 'asistencia',
          include: [
            {
              model: Matricula,
              as: 'matricula',
              include: [
                { model: Estudiante, as: 'estudiante' },
                { model: Seccion, as: 'seccion' }
              ]
            }
          ]
        }
      ],
      order: [['created_at', 'DESC']]
    });
    res.json({ data: result });
  }),

  obtenerPorId: wrapAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const result = await JustificacionEstudiante.findByPk(id, {
      include: [
        {
          model: AsistenciaEstudiante,
          as: 'asistencia',
          include: [
            {
              model: Matricula,
              as: 'matricula',
              include: [
                { model: Estudiante, as: 'estudiante' },
                { model: Seccion, as: 'seccion' }
              ]
            }
          ]
        }
      ]
    });
    if (!result) {
      res.status(404).json({ error: { message: 'Recurso no encontrado' } });
      return;
    }
    res.json({ data: result });
  }),

  listarPorAsistencia: wrapAsync(async (req: Request, res: Response) => {
    const idAsistenciaEst = Number(req.params.id_asistencia_est);
    const result = await JustificacionEstudiante.findAll({
      where: { id_asistencia_est: idAsistenciaEst },
      order: [['created_at', 'DESC']]
    });
    res.json({ data: result });
  }),

  crear: wrapAsync(async (req: Request, res: Response) => {
    const parsed = crearJustificacionEstudianteSchema.safeParse(req.body);
    if (!parsed.success) {
      const details: Record<string, string[]> = {};
      for (const issue of parsed.error.issues) {
        const path = issue.path.join('.') || '_root';
        (details[path] ??= []).push(issue.message);
      }
      res.status(400).json({ error: { message: 'Error de validación', details } });
      return;
    }

    const { id_asistencia_est, id_estudiante, fecha, id_horario, motivo, soporte_digital } = parsed.data;

    let asistencia: any;

    if (id_asistencia_est) {
      asistencia = await AsistenciaEstudiante.findByPk(id_asistencia_est);
      if (!asistencia) {
        res.status(404).json({ error: { message: 'Registro de asistencia de estudiante no encontrado' } });
        return;
      }
    } else if (id_estudiante && fecha) {
      const periodoActivo = await (await import('../models')).PeriodoEscolar.findOne({ where: { estatus: 'Activo' } });
      if (!periodoActivo) {
        res.status(400).json({ error: { message: 'No hay periodo escolar activo' } });
        return;
      }
      const matricula = await Matricula.findOne({
        where: { id_estudiante, id_periodo: periodoActivo.id_periodo }
      });
      if (!matricula) {
        res.status(400).json({ error: { message: 'El estudiante no tiene matrícula en el periodo activo' } });
        return;
      }

      const whereClause: any = { id_matricula: matricula.id_matricula, fecha };
      if (id_horario != null) whereClause.id_horario = id_horario;

      const existing = await AsistenciaEstudiante.findOne({ where: whereClause });
      if (existing) {
        asistencia = existing;
      } else {
        asistencia = await AsistenciaEstudiante.create({
          id_matricula: matricula.id_matricula,
          fecha,
          id_horario: id_horario || null,
          estatus: 'Justificado',
          id_usuario_crea: (req as any).user?.idUsuario || null,
        });
      }
    } else {
      res.status(400).json({ error: { message: 'Datos insuficientes para crear justificación' } });
      return;
    }

    const result = await sequelize.transaction(async (t) => {
      const justificacion = await JustificacionEstudiante.create(
        {
          id_asistencia_est: asistencia.id_asistencia_est,
          motivo,
          soporte_digital: soporte_digital || null,
        },
        { transaction: t }
      );
      if (asistencia.estatus !== 'Justificado') {
        await asistencia.update({ estatus: 'Justificado' }, { transaction: t });
      }
      return justificacion;
    });

    const asistenciaCompleta = await AsistenciaEstudiante.findByPk(asistencia.id_asistencia_est, {
      include: [{
        model: Matricula,
        as: 'matricula',
        include: [
          { model: Estudiante, as: 'estudiante' },
          { model: Seccion, as: 'seccion' }
        ]
      }]
    });

    res.status(201).json({ data: result, asistencia: asistenciaCompleta });
  }),

  actualizar: wrapAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const record = await JustificacionEstudiante.findByPk(id);
    if (!record) {
      res.status(404).json({ error: { message: 'Recurso no encontrado' } });
      return;
    }

    const parsed = actualizarJustificacionSchema.safeParse(req.body);
    if (!parsed.success) {
      const details: Record<string, string[]> = {};
      for (const issue of parsed.error.issues) {
        const path = issue.path.join('.') || '_root';
        (details[path] ??= []).push(issue.message);
      }
      res.status(400).json({ error: { message: 'Error de validación', details } });
      return;
    }

    await record.update(parsed.data);
    res.json({ data: record });
  }),

  eliminar: wrapAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const record = await JustificacionEstudiante.findByPk(id);
    if (!record) {
      res.status(404).json({ error: { message: 'Recurso no encontrado' } });
      return;
    }

    await sequelize.transaction(async (t) => {
      const asistencia = await AsistenciaEstudiante.findByPk(record.id_asistencia_est, { transaction: t });
      if (asistencia && asistencia.estatus === 'Justificado') {
        await asistencia.update({ estatus: 'Ausente' }, { transaction: t });
      }
      await record.destroy({ transaction: t });
    });
    res.status(204).send();
  }),
};
