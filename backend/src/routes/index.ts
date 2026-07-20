import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { csrfProtection } from '../middlewares/csrf.middleware';
import { authRoutes } from './auth.routes';
import { chatbotRoutes } from './chatbot.routes';
import { usuarioRoutes } from './usuario.routes';
import { rolRoutes } from './rol.routes';
import { periodoEscolarRoutes } from './periodo-escolar.routes';
import { gradoAnoRoutes } from './grado-ano.routes';
import { seccionRoutes } from './seccion.routes';
import { asignaturaRoutes } from './asignatura.routes';
import { planEstudioRoutes } from './plan-estudio.routes';
import { tipoPlanEstudioRoutes } from './tipo-plan-estudio.routes';
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
import { justificacionEstudianteRoutes } from './justificacion-estudiante.routes';
import { observacionEstudianteRoutes } from './observacion-estudiante.routes';
import { systemRoutes } from './system.routes';
import { notificacionRoutes } from './notificacion.routes';
import { materiaPendienteRoutes } from './materia-pendiente.routes';
import { especialidadRoutes } from './especialidad.routes';
import { formatoSabanaRoutes } from './formato-sabana.routes';


export const routes = Router();

// Auth and chatbot routes are public (no auth middleware)
routes.use('/auth', authRoutes);
routes.use('/chatbot', chatbotRoutes);




// CSRF protection + authentication for all non-public routes
routes.use(csrfProtection);
routes.use(authMiddleware);

routes.use('/usuarios', usuarioRoutes);
routes.use('/roles', rolRoutes);
routes.use('/periodos', periodoEscolarRoutes);
routes.use('/grados', gradoAnoRoutes);
routes.use('/secciones', seccionRoutes);
routes.use('/asignaturas', asignaturaRoutes);
routes.use('/plan-estudio', planEstudioRoutes);
routes.use('/tipo-plan-estudio', tipoPlanEstudioRoutes);
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
routes.use('/justificaciones-estudiantes', justificacionEstudianteRoutes);
routes.use('/observaciones-estudiantes', observacionEstudianteRoutes);
routes.use('/auditorias', auditoriaRoutes);
routes.use('/evaluaciones', evaluacionRoutes);
routes.use('/system', systemRoutes);
routes.use('/notificaciones', notificacionRoutes);
routes.use('/materias-pendientes', materiaPendienteRoutes);
routes.use('/especialidades', especialidadRoutes);
routes.use('/formatos', formatoSabanaRoutes);
