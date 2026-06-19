import { Router } from 'express';
import { AsistenciaDocenteController } from '../controllers/asistencia-docente.controller';
import { authorize } from '../middlewares/rbac.middleware';

export const asistenciaDocenteRoutes = Router();

asistenciaDocenteRoutes.get('/', AsistenciaDocenteController.listar);
asistenciaDocenteRoutes.get('/:id', AsistenciaDocenteController.obtenerPorId);
asistenciaDocenteRoutes.post('/', authorize(1, 3), AsistenciaDocenteController.crear);
asistenciaDocenteRoutes.patch('/:id', AsistenciaDocenteController.actualizar);
asistenciaDocenteRoutes.delete('/:id', authorize(1), AsistenciaDocenteController.eliminar);
