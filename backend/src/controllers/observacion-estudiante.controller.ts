import { Request, Response } from 'express';
import { ObservacionEstudiante, AsistenciaEstudiante, Matricula, Estudiante, Seccion, Usuario } from '../models';
import { wrapAsync } from '../shared/utils/wrapAsync';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { crearObservacionEstudianteSchema, actualizarObservacionEstudianteSchema } from '../validators/observacion-estudiante.schema';

const ASISTENCIA_INCLUDES = [{
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
}];

export const ObservacionEstudianteController = {
  listar: wrapAsync(async (_req: Request, res: Response) => {
    const result = await ObservacionEstudiante.findAll({
      include: [
        ...ASISTENCIA_INCLUDES,
        { model: Usuario, as: 'usuarioCrea', attributes: ['id_usuario', 'nombre', 'apellido'] }
      ],
      order: [['created_at', 'DESC']]
    });
    res.json({ data: result });
  }),

  obtenerPorId: wrapAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const result = await ObservacionEstudiante.findByPk(id, {
      include: [
        ...ASISTENCIA_INCLUDES,
        { model: Usuario, as: 'usuarioCrea', attributes: ['id_usuario', 'nombre', 'apellido'] }
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
    const result = await ObservacionEstudiante.findAll({
      where: { id_observacion: idAsistenciaEst },
      order: [['created_at', 'DESC']]
    });
    res.json({ data: result });
  }),

  crear: wrapAsync(async (req: AuthenticatedRequest, res: Response) => {
    const parsed = crearObservacionEstudianteSchema.safeParse(req.body);
    if (!parsed.success) {
      const details: Record<string, string[]> = {};
      for (const issue of parsed.error.issues) {
        const path = issue.path.join('.') || '_root';
        (details[path] ??= []).push(issue.message);
      }
      res.status(400).json({ error: { message: 'Error de validación', details } });
      return;
    }

    const { texto, gravedad } = parsed.data;

    const result = await ObservacionEstudiante.create({
      texto,
      gravedad: gravedad || null,
      id_usuario_crea: req.user!.idUsuario,
    });

    res.status(201).json({ data: result });
  }),

  actualizar: wrapAsync(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const record = await ObservacionEstudiante.findByPk(id);
    if (!record) {
      res.status(404).json({ error: { message: 'Recurso no encontrado' } });
      return;
    }

    const parsed = actualizarObservacionEstudianteSchema.safeParse(req.body);
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
    const record = await ObservacionEstudiante.findByPk(id);
    if (!record) {
      res.status(404).json({ error: { message: 'Recurso no encontrado' } });
      return;
    }

    await record.destroy();
    res.status(204).send();
  }),
};
