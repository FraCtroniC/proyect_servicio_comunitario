import { Router } from 'express';
import { EscalaCalificacionController } from '../controllers/escala-calificacion.controller';
import { authorize } from '../middlewares/rbac.middleware';

export const escalaCalificacionRoutes = Router();

escalaCalificacionRoutes.get('/', EscalaCalificacionController.listar);
escalaCalificacionRoutes.get('/:id', EscalaCalificacionController.obtenerPorId);
escalaCalificacionRoutes.post('/', authorize(1, 3), EscalaCalificacionController.crear);
escalaCalificacionRoutes.patch('/:id', authorize(1, 3), EscalaCalificacionController.actualizar);
escalaCalificacionRoutes.delete('/:id', authorize(1), EscalaCalificacionController.eliminar);
