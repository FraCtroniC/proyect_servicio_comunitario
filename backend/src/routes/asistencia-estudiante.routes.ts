import { Router } from 'express';
import { AsistenciaEstudianteController } from '../controllers/asistencia-estudiante.controller';
import { authorize } from '../middlewares/rbac.middleware';

export const asistenciaEstudianteRoutes = Router();

asistenciaEstudianteRoutes.get('/', AsistenciaEstudianteController.listar);
asistenciaEstudianteRoutes.post('/', authorize(1, 2, 3), AsistenciaEstudianteController.crear);
asistenciaEstudianteRoutes.post('/sync-inasistencias', authorize(1, 3), AsistenciaEstudianteController.syncInasistencias);
asistenciaEstudianteRoutes.patch('/:id', authorize(1, 2, 3), AsistenciaEstudianteController.actualizar);
asistenciaEstudianteRoutes.get('/estadisticas', AsistenciaEstudianteController.estadisticas);
