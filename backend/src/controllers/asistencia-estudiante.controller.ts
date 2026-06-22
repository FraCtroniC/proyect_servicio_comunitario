import { Request, Response } from 'express';
import { AsistenciaEstudiante, Matricula, Estudiante } from '../models';
import { wrapAsync } from '../shared/utils/wrapAsync';

export const AsistenciaEstudianteController = {
  // Obtener todas las asistencias de estudiantes
  listar: wrapAsync(async (req: Request, res: Response) => {
    const result = await AsistenciaEstudiante.findAll({
      include: [
        {
          model: Matricula,
          as: 'matricula',
          include: [
            {
              model: Estudiante,
              as: 'estudiante'
            }
          ]
        }
      ]
    });
    res.json({ data: result });
  }),

  // Crear asistencia
  crear: wrapAsync(async (req: Request, res: Response) => {
    const { id_matricula, fecha, estatus, observacion } = req.body;
    const nueva = await AsistenciaEstudiante.create({
      id_matricula,
      fecha,
      estatus,
      observacion
    });
    res.status(201).json(nueva);
  }),

  // Actualizar asistencia
  actualizar: wrapAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const record = await AsistenciaEstudiante.findByPk(id);
    if (!record) {
      res.status(404).json({ error: { message: 'Asistencia de estudiante no encontrada' } });
      return;
    }
    await record.update(req.body);
    res.json(record);
  })
};
