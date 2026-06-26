import { Router } from 'express';
import { AsistenciaEstudianteController } from '../controllers/asistencia-estudiante.controller';
import { authorize } from '../middlewares/rbac.middleware';
import { ROLES } from '../shared/constants';

export const asistenciaEstudianteRoutes = Router();

asistenciaEstudianteRoutes.get('/', AsistenciaEstudianteController.listar);
asistenciaEstudianteRoutes.get('/estadisticas', AsistenciaEstudianteController.estadisticas);
asistenciaEstudianteRoutes.post('/', authorize(ROLES.SUPER_ADMIN, ROLES.CONTROL_ESTUDIOS, ROLES.DOCENTE), AsistenciaEstudianteController.crear);
asistenciaEstudianteRoutes.post('/batch', authorize(ROLES.SUPER_ADMIN, ROLES.CONTROL_ESTUDIOS, ROLES.DOCENTE), AsistenciaEstudianteController.crearBatch);
asistenciaEstudianteRoutes.post('/sync-inasistencias', authorize(ROLES.SUPER_ADMIN, ROLES.DOCENTE), AsistenciaEstudianteController.syncInasistencias);
asistenciaEstudianteRoutes.post('/sync-inasistencias-batch', authorize(ROLES.SUPER_ADMIN, ROLES.DOCENTE), AsistenciaEstudianteController.syncInasistenciasBatch);
asistenciaEstudianteRoutes.patch('/:id', authorize(ROLES.SUPER_ADMIN, ROLES.CONTROL_ESTUDIOS, ROLES.DOCENTE), AsistenciaEstudianteController.actualizar);
