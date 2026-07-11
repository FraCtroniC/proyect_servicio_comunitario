import { Router } from 'express';
import { MomentoController } from '../controllers/momento.controller';
import { validateCrearMomento } from '../validators/momento.validator';
import { authorize } from '../middlewares/rbac.middleware';
import { cacheable, invalidates } from '../middlewares/cache.middleware';

export const momentoRoutes = Router();

momentoRoutes.get('/', cacheable({ ttl: 3600 }), MomentoController.listar);
momentoRoutes.get('/:id', cacheable({ ttl: 3600 }), MomentoController.obtenerPorId);
momentoRoutes.post('/', authorize('Administrador', 'Control de Estudios', 'Coordinador'), validateCrearMomento, invalidates('momentos:*'), MomentoController.crear);
momentoRoutes.patch('/:id', authorize('Administrador', 'Control de Estudios', 'Coordinador'), invalidates('momentos:*'), MomentoController.actualizar);
momentoRoutes.delete('/:id', authorize('Administrador'), invalidates('momentos:*'), MomentoController.eliminar);
