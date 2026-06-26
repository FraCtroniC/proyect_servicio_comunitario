import { Router } from 'express';
import { SeccionController } from '../controllers/seccion.controller';
import { validateCrearSeccion } from '../validators/seccion.validator';
import { authorize } from '../middlewares/rbac.middleware';

export const seccionRoutes = Router();

seccionRoutes.get('/', SeccionController.listar);
seccionRoutes.get('/:id', SeccionController.obtenerPorId);
seccionRoutes.post('/', authorize(1, 3), validateCrearSeccion, SeccionController.crear);
seccionRoutes.patch('/:id', authorize(1, 3), SeccionController.actualizar);
seccionRoutes.delete('/:id', authorize(1), SeccionController.eliminar);
