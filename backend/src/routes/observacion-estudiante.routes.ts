import { Router } from 'express';
import { ObservacionEstudianteController } from '../controllers/observacion-estudiante.controller';
import { authorize } from '../middlewares/rbac.middleware';

export const observacionEstudianteRoutes = Router();

observacionEstudianteRoutes.get('/', ObservacionEstudianteController.listar);
observacionEstudianteRoutes.get('/por-asistencia/:id_asistencia_est', ObservacionEstudianteController.listarPorAsistencia);
observacionEstudianteRoutes.get('/:id', ObservacionEstudianteController.obtenerPorId);
observacionEstudianteRoutes.post('/', authorize('Administrador', 'Control de Estudios', 'Coordinador', 'Docente'), ObservacionEstudianteController.crear);
observacionEstudianteRoutes.patch('/:id', authorize('Administrador', 'Control de Estudios', 'Coordinador', 'Docente'), ObservacionEstudianteController.actualizar);
observacionEstudianteRoutes.delete('/:id', authorize('Administrador', 'Control de Estudios'), ObservacionEstudianteController.eliminar);
