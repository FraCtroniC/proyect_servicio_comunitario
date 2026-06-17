import { Router } from 'express';
import { CalificacionController } from '../controllers/calificacion.controller';

export const calificacionRoutes = Router();

calificacionRoutes.get('/', CalificacionController.listar);
calificacionRoutes.get('/:id', CalificacionController.obtenerPorId);
calificacionRoutes.post('/', CalificacionController.crear);
calificacionRoutes.patch('/:id', CalificacionController.actualizar);
calificacionRoutes.delete('/:id', CalificacionController.eliminar);
