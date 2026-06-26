import { Router } from 'express';
import { JustificacionController } from '../controllers/justificacion.controller';
import { authorize } from '../middlewares/rbac.middleware';

export const justificacionRoutes = Router();

justificacionRoutes.get('/', JustificacionController.listar);
justificacionRoutes.get('/:id', JustificacionController.obtenerPorId);
justificacionRoutes.post('/', authorize(1, 3, 4), JustificacionController.crear);
justificacionRoutes.patch('/:id', authorize(1, 3, 4), JustificacionController.actualizar);
justificacionRoutes.delete('/:id', authorize(1), JustificacionController.eliminar);
