import { Router } from 'express';
import { AsistenciaEstudianteController } from '../controllers/asistencia-estudiante.controller';
import { authorize } from '../middlewares/rbac.middleware';

export const asistenciaEstudianteRoutes = Router();

asistenciaEstudianteRoutes.get('/', AsistenciaEstudianteController.listar);
asistenciaEstudianteRoutes.get('/estadisticas', AsistenciaEstudianteController.estadisticas);
asistenciaEstudianteRoutes.post('/', authorize('Administrador', 'Control de Estudios', 'Coordinador', 'Docente', 4, 5, 7, 8), AsistenciaEstudianteController.crear);
asistenciaEstudianteRoutes.post('/batch', authorize('Administrador', 'Control de Estudios', 'Coordinador', 'Docente', 4, 5, 7, 8), AsistenciaEstudianteController.crearBatch);
asistenciaEstudianteRoutes.post('/por-horario', authorize('Administrador', 'Control de Estudios', 'Coordinador', 'Docente', 4, 5, 7, 8), AsistenciaEstudianteController.porHorario);
asistenciaEstudianteRoutes.post('/sync-inasistencias', authorize('Administrador', 'Control de Estudios', 'Docente', 4, 5, 8), AsistenciaEstudianteController.syncInasistencias);
asistenciaEstudianteRoutes.post('/sync-inasistencias-batch', authorize('Administrador', 'Control de Estudios', 'Docente', 4, 5, 8), AsistenciaEstudianteController.syncInasistenciasBatch);
asistenciaEstudianteRoutes.patch('/:id', authorize('Administrador', 'Control de Estudios', 'Coordinador', 'Docente', 4, 5, 7, 8), AsistenciaEstudianteController.actualizar);
asistenciaEstudianteRoutes.delete('/:id', authorize('Administrador', 4), AsistenciaEstudianteController.eliminar);
