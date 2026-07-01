import { Router } from 'express';
import { RolController } from '../controllers/rol.controller';
import { authorize } from '../middlewares/rbac.middleware';

export const rolRoutes = Router();

rolRoutes.get('/', RolController.listar);
rolRoutes.get('/:id', RolController.obtenerPorId);
rolRoutes.post('/', authorize('Administrador'), RolController.crear);
rolRoutes.patch('/:id', authorize('Administrador'), RolController.actualizar);
rolRoutes.delete('/:id', authorize('Administrador'), RolController.eliminar);
