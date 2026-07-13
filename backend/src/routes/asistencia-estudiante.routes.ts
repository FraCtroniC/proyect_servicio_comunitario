import { Router } from 'express';
import { AsistenciaEstudianteController } from '../controllers/asistencia-estudiante.controller';
import { authorize } from '../middlewares/rbac.middleware';

export const asistenciaEstudianteRoutes = Router();

asistenciaEstudianteRoutes.get('/', AsistenciaEstudianteController.listar);
asistenciaEstudianteRoutes.get('/estadisticas', AsistenciaEstudianteController.estadisticas);
asistenciaEstudianteRoutes.post('/', authorize('Administrador', 'Control de Estudios', 'Coordinador', 'Docente'), AsistenciaEstudianteController.crear);
asistenciaEstudianteRoutes.post('/batch', authorize('Administrador', 'Control de Estudios', 'Coordinador', 'Docente'), AsistenciaEstudianteController.crearBatch);
asistenciaEstudianteRoutes.post('/sync-inasistencias', authorize('Administrador', 'Control de Estudios', 'Docente'), AsistenciaEstudianteController.syncInasistencias);
asistenciaEstudianteRoutes.post('/sync-inasistencias-batch', authorize('Administrador', 'Control de Estudios', 'Docente'), AsistenciaEstudianteController.syncInasistenciasBatch);
asistenciaEstudianteRoutes.patch('/:id', authorize('Administrador', 'Control de Estudios', 'Coordinador', 'Docente'), AsistenciaEstudianteController.actualizar);
