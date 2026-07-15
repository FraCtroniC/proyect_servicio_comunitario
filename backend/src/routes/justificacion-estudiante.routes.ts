import { Router } from 'express';
import { JustificacionEstudianteController } from '../controllers/justificacion-estudiante.controller';
import { authorize } from '../middlewares/rbac.middleware';

export const justificacionEstudianteRoutes = Router();

justificacionEstudianteRoutes.get('/', JustificacionEstudianteController.listar);
justificacionEstudianteRoutes.get('/por-asistencia/:id_asistencia_est', JustificacionEstudianteController.listarPorAsistencia);
justificacionEstudianteRoutes.get('/:id', JustificacionEstudianteController.obtenerPorId);
justificacionEstudianteRoutes.post('/', authorize('Administrador', 'Control de Estudios', 'Coordinador', 'Docente'), JustificacionEstudianteController.crear);
justificacionEstudianteRoutes.patch('/:id', authorize('Administrador', 'Control de Estudios'), JustificacionEstudianteController.actualizar);
justificacionEstudianteRoutes.delete('/:id', authorize('Administrador'), JustificacionEstudianteController.eliminar);
