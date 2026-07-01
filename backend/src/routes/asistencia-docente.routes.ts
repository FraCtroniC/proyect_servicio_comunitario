import { Router } from 'express';
import { AsistenciaDocenteController } from '../controllers/asistencia-docente.controller';
import { authorize } from '../middlewares/rbac.middleware';
import { ROLES } from '../shared/constants';

export const asistenciaDocenteRoutes = Router();

asistenciaDocenteRoutes.get('/', AsistenciaDocenteController.listar);
asistenciaDocenteRoutes.get('/estadisticas', AsistenciaDocenteController.estadisticas);
asistenciaDocenteRoutes.get('/:id', AsistenciaDocenteController.obtenerPorId);
asistenciaDocenteRoutes.post('/', authorize(ROLES.SUPER_ADMIN, ROLES.DOCENTE), AsistenciaDocenteController.crear);
asistenciaDocenteRoutes.patch('/:id', authorize('Administrador', 'Control de Estudios', 'Coordinador', 'Docente'), AsistenciaDocenteController.actualizar);
asistenciaDocenteRoutes.delete('/:id', authorize('Administrador'), AsistenciaDocenteController.eliminar);
