import { Router } from 'express';
import { EspecialidadController } from '../controllers/especialidad.controller';
import { authorize } from '../middlewares/rbac.middleware';
import { ROLES } from '../shared/constants';

export const especialidadRoutes = Router();

// Todas las rutas de especialidades requieren autenticación
// Para listar, todos pueden ver
especialidadRoutes.get('/', EspecialidadController.getAll);

// Para crear, solo super_admin y control_estudios
especialidadRoutes.post(
  '/',
  authorize('Administrador', 'Control de Estudios'),
  EspecialidadController.create
);
