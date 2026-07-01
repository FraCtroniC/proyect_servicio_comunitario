import { Router } from 'express';
import { CalificacionController } from '../controllers/calificacion.controller';
import { validateCrearCalificacion } from '../validators/calificacion.validator';
import { authorize } from '../middlewares/rbac.middleware';

export const calificacionRoutes = Router();

calificacionRoutes.get('/', CalificacionController.listar);
calificacionRoutes.get('/:id', CalificacionController.obtenerPorId);
calificacionRoutes.post('/bulk', authorize(1, 2, 4), CalificacionController.bulkUpsert);
calificacionRoutes.post('/', authorize(1, 2, 4), validateCrearCalificacion, CalificacionController.crear);
calificacionRoutes.patch('/:id', authorize(1, 2, 4), CalificacionController.actualizar);
calificacionRoutes.delete('/:id', authorize('Administrador'), CalificacionController.eliminar);
