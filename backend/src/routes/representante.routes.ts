import { Router } from 'express';
import { RepresentanteController } from '../controllers/representante.controller';
import { validateCrearRepresentante } from '../validators/representante.validator';
import { authorize } from '../middlewares/rbac.middleware';
import { cacheable, invalidates } from '../middlewares/cache.middleware';

export const representanteRoutes = Router();

representanteRoutes.get('/', cacheable({ ttl: 600 }), RepresentanteController.listar);
representanteRoutes.get('/:id', cacheable({ ttl: 600 }), RepresentanteController.obtenerPorId);
representanteRoutes.post('/', authorize('Administrador', 'Control de Estudios', 'Coordinador'), validateCrearRepresentante, invalidates('representantes:*'), RepresentanteController.crear);
representanteRoutes.patch('/:id', authorize('Administrador', 'Control de Estudios', 'Coordinador'), invalidates('representantes:*'), RepresentanteController.actualizar);
representanteRoutes.delete('/:id', authorize('Administrador'), invalidates('representantes:*'), RepresentanteController.eliminar);
