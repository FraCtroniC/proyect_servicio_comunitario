import { Router } from 'express';
import { EscalaCalificacionController } from '../controllers/escala-calificacion.controller';

export const escalaCalificacionRoutes = Router();

escalaCalificacionRoutes.get('/', EscalaCalificacionController.listar);
escalaCalificacionRoutes.get('/:id', EscalaCalificacionController.obtenerPorId);
escalaCalificacionRoutes.post('/', EscalaCalificacionController.crear);
escalaCalificacionRoutes.patch('/:id', EscalaCalificacionController.actualizar);
escalaCalificacionRoutes.delete('/:id', EscalaCalificacionController.eliminar);
