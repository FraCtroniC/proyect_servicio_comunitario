import { Router } from 'express';
import { SeccionController } from '../controllers/seccion.controller';
import { validateCrearSeccion, validateActualizarSeccion } from '../validators/seccion.validator';
import { authorize } from '../middlewares/rbac.middleware';

export const seccionRoutes = Router();

seccionRoutes.get('/', SeccionController.listar);
seccionRoutes.get('/:id', SeccionController.obtenerPorId);
seccionRoutes.post('/', authorize('Administrador', 'Control de Estudios', 'Coordinador'), validateCrearSeccion, SeccionController.crear);
seccionRoutes.patch('/:id', authorize('Administrador', 'Control de Estudios', 'Coordinador'), validateActualizarSeccion, SeccionController.actualizar);
seccionRoutes.delete('/:id', authorize('Administrador'), SeccionController.eliminar);
