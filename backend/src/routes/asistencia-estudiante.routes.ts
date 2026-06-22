import { Router } from 'express';
import { AsistenciaEstudianteController } from '../controllers/asistencia-estudiante.controller';
import { authorize } from '../middlewares/rbac.middleware';

export const asistenciaEstudianteRoutes = Router();

asistenciaEstudianteRoutes.get('/', AsistenciaEstudianteController.listar);
asistenciaEstudianteRoutes.post('/', authorize(1, 2, 3), AsistenciaEstudianteController.crear);
asistenciaEstudianteRoutes.patch('/:id', authorize(1, 2, 3), AsistenciaEstudianteController.actualizar);
