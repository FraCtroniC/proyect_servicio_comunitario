import { Router } from 'express';
import { JustificacionController } from '../controllers/justificacion.controller';

export const justificacionRoutes = Router();

justificacionRoutes.get('/', JustificacionController.listar);
justificacionRoutes.get('/:id', JustificacionController.obtenerPorId);
justificacionRoutes.post('/', JustificacionController.crear);
justificacionRoutes.patch('/:id', JustificacionController.actualizar);
justificacionRoutes.delete('/:id', JustificacionController.eliminar);
