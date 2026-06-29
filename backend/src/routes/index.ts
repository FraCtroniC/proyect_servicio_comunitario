import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { authRoutes } from './auth.routes';
import { usuarioRoutes } from './usuario.routes';
import { rolRoutes } from './rol.routes';
import { docenteRoutes } from './docente.routes';
import { periodoEscolarRoutes } from './periodo-escolar.routes';
import { gradoAnoRoutes } from './grado-ano.routes';
import { seccionRoutes } from './seccion.routes';
import { asignaturaRoutes } from './asignatura.routes';
import { planEstudioRoutes } from './plan-estudio.routes';
import { representanteRoutes } from './representante.routes';
import { estudianteRoutes } from './estudiante.routes';
import { matriculaRoutes } from './matricula.routes';
import { momentoRoutes } from './momento.routes';
import { escalaCalificacionRoutes } from './escala-calificacion.routes';
import { calificacionRoutes } from './calificacion.routes';
import { historicoNotaCertificadaRoutes } from './historico-nota-certificada.routes';
import { aulaRoutes } from './aula.routes';
import { diaSemanaRoutes } from './dia-semana.routes';
import { bloqueHorarioRoutes } from './bloque-horario.routes';
import { horarioDocenteRoutes } from './horario-docente.routes';
import { asistenciaDocenteRoutes } from './asistencia-docente.routes';
import { justificacionRoutes } from './justificacion.routes';
import { auditoriaRoutes } from './auditoria.routes';
import { evaluacionRoutes } from './evaluacion.routes';
import { asistenciaEstudianteRoutes } from './asistencia-estudiante.routes';
import { systemRoutes } from './system.routes';
import { notificacionRoutes } from './notificacion.routes';
import { materiaPendienteRoutes } from './materia-pendiente.routes';
import { especialidadRoutes } from './especialidad.routes';

export const routes = Router();

// Auth routes are public (no auth middleware)
routes.use('/auth', authRoutes);

routes.get('/test-docentes', async (req, res) => {
  try {
    const { Docente } = require('../models/Docente');
    const result = await Docente.findAll();
    res.json({ data: result });
  } catch (e: any) {
    res.status(500).json({ error: e.message, stack: e.stack });
  }
});

// All other routes require authentication
routes.use(authMiddleware);

routes.use('/usuarios', usuarioRoutes);
routes.use('/roles', rolRoutes);
routes.use('/docentes', docenteRoutes);
routes.use('/periodos', periodoEscolarRoutes);
routes.use('/grados', gradoAnoRoutes);
routes.use('/secciones', seccionRoutes);
routes.use('/asignaturas', asignaturaRoutes);
routes.use('/plan-estudio', planEstudioRoutes);
routes.use('/representantes', representanteRoutes);
routes.use('/estudiantes', estudianteRoutes);
routes.use('/matriculas', matriculaRoutes);
routes.use('/momentos', momentoRoutes);
routes.use('/escalas', escalaCalificacionRoutes);
routes.use('/calificaciones', calificacionRoutes);
routes.use('/historicos', historicoNotaCertificadaRoutes);
routes.use('/aulas', aulaRoutes);
routes.use('/dias', diaSemanaRoutes);
routes.use('/bloques', bloqueHorarioRoutes);
routes.use('/horarios', horarioDocenteRoutes);
routes.use('/asistencias', asistenciaDocenteRoutes);
routes.use('/asistencias-estudiantes', asistenciaEstudianteRoutes);
routes.use('/justificaciones', justificacionRoutes);
routes.use('/auditorias', auditoriaRoutes);
routes.use('/evaluaciones', evaluacionRoutes);
routes.use('/system', systemRoutes);
routes.use('/notificaciones', notificacionRoutes);
routes.use('/materias-pendientes', materiaPendienteRoutes);
routes.use('/especialidades', especialidadRoutes);
