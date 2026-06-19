import { Router } from 'express';
import { RolController } from '../controllers/rol.controller';
import { authorize } from '../middlewares/rbac.middleware';

export const rolRoutes = Router();

rolRoutes.get('/', RolController.listar);
rolRoutes.get('/:id', RolController.obtenerPorId);
rolRoutes.post('/', authorize(1), RolController.crear);
rolRoutes.patch('/:id', authorize(1), RolController.actualizar);
rolRoutes.delete('/:id', authorize(1), RolController.eliminar);
