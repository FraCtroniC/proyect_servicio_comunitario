import { Router } from 'express';
import { RolController } from '../controllers/rol.controller';
import { authorize } from '../middlewares/rbac.middleware';
import { cacheable, invalidates } from '../middlewares/cache.middleware';

export const rolRoutes = Router();

rolRoutes.get('/', cacheable({ ttl: 3600 }), RolController.listar);
rolRoutes.get('/:id', cacheable({ ttl: 3600 }), RolController.obtenerPorId);
rolRoutes.post('/', authorize('Administrador'), invalidates('roles:*'), RolController.crear);
rolRoutes.patch('/:id', authorize('Administrador'), invalidates('roles:*'), RolController.actualizar);
rolRoutes.delete('/:id', authorize('Administrador'), invalidates('roles:*'), RolController.eliminar);
