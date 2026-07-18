import { Router } from 'express';
import { EspecialidadController } from '../controllers/especialidad.controller';
import { authorize } from '../middlewares/rbac.middleware';

export const especialidadRoutes = Router();

especialidadRoutes.get('/', EspecialidadController.getAll);

especialidadRoutes.post(
  '/',
  authorize('Administrador', 'Control de Estudios'),
  EspecialidadController.create
);
