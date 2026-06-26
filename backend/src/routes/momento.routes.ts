import { Router } from 'express';
import { MomentoController } from '../controllers/momento.controller';
import { validateCrearMomento } from '../validators/momento.validator';
import { authorize } from '../middlewares/rbac.middleware';

export const momentoRoutes = Router();

momentoRoutes.get('/', MomentoController.listar);
momentoRoutes.get('/:id', MomentoController.obtenerPorId);
momentoRoutes.post('/', authorize(1, 3), validateCrearMomento, MomentoController.crear);
momentoRoutes.patch('/:id', authorize(1, 3), MomentoController.actualizar);
momentoRoutes.delete('/:id', authorize(1), MomentoController.eliminar);
