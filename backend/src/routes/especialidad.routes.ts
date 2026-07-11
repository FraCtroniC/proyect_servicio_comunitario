import { Router } from 'express';
import { EspecialidadController } from '../controllers/especialidad.controller';
import { authorize } from '../middlewares/rbac.middleware';
import { cacheable, invalidates } from '../middlewares/cache.middleware';

export const especialidadRoutes = Router();

especialidadRoutes.get('/', cacheable({ ttl: 3600 }), EspecialidadController.getAll);

especialidadRoutes.post(
  '/',
  authorize('Administrador', 'Control de Estudios'),
  invalidates('especialidades:*'),
  EspecialidadController.create
);
