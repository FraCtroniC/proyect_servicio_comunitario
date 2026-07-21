import { Router } from 'express';
import { CalificacionController } from '../controllers/calificacion.controller';
import { validateCrearCalificacion } from '../validators/calificacion.validator';
import { authorize } from '../middlewares/rbac.middleware';

export const calificacionRoutes = Router();

calificacionRoutes.get('/', CalificacionController.listar);
calificacionRoutes.get('/:id', CalificacionController.obtenerPorId);
calificacionRoutes.post('/bulk', authorize('Administrador', 'Control de Estudios', 'Coordinador', 'Docente'), CalificacionController.bulkUpsert);
calificacionRoutes.post('/', authorize('Administrador', 'Control de Estudios', 'Coordinador', 'Docente'), validateCrearCalificacion, CalificacionController.crear);
calificacionRoutes.patch('/:id', authorize('Administrador', 'Control de Estudios', 'Coordinador', 'Docente'), CalificacionController.actualizar);
calificacionRoutes.delete('/:id', authorize('Administrador'), CalificacionController.eliminar);
