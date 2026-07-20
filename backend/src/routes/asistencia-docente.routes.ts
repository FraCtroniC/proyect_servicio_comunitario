import { Router } from 'express';
import { AsistenciaDocenteController } from '../controllers/asistencia-docente.controller';
import { authorize } from '../middlewares/rbac.middleware';

export const asistenciaDocenteRoutes = Router();

asistenciaDocenteRoutes.get('/', AsistenciaDocenteController.listar);
asistenciaDocenteRoutes.get('/estadisticas', AsistenciaDocenteController.estadisticas);
asistenciaDocenteRoutes.get('/:id', AsistenciaDocenteController.obtenerPorId);
asistenciaDocenteRoutes.post('/', authorize('Administrador', 'Docente', 4, 5), AsistenciaDocenteController.crear);
asistenciaDocenteRoutes.patch('/:id', authorize('Administrador', 'Control de Estudios', 'Coordinador', 'Docente', 4, 5, 7, 8), AsistenciaDocenteController.actualizar);
asistenciaDocenteRoutes.delete('/:id', authorize('Administrador', 4), AsistenciaDocenteController.eliminar);
