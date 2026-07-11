import { Router } from 'express';
import { SeccionController } from '../controllers/seccion.controller';
import { validateCrearSeccion } from '../validators/seccion.validator';
import { authorize } from '../middlewares/rbac.middleware';
import { cacheable, invalidates } from '../middlewares/cache.middleware';

export const seccionRoutes = Router();

seccionRoutes.get('/', cacheable({ ttl: 3600 }), SeccionController.listar);
seccionRoutes.get('/:id', cacheable({ ttl: 3600 }), SeccionController.obtenerPorId);
seccionRoutes.post('/', authorize('Administrador', 'Control de Estudios', 'Coordinador'), validateCrearSeccion, invalidates('secciones:*'), SeccionController.crear);
seccionRoutes.patch('/:id', authorize('Administrador', 'Control de Estudios', 'Coordinador'), invalidates('secciones:*'), SeccionController.actualizar);
seccionRoutes.delete('/:id', authorize('Administrador'), invalidates('secciones:*'), SeccionController.eliminar);
