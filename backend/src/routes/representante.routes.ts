import { Router } from 'express';
import { RepresentanteController } from '../controllers/representante.controller';
import { validateCrearRepresentante } from '../validators/representante.validator';
import { authorize } from '../middlewares/rbac.middleware';

export const representanteRoutes = Router();

representanteRoutes.get('/', RepresentanteController.listar);
representanteRoutes.get('/:id', RepresentanteController.obtenerPorId);
representanteRoutes.post('/', authorize('Administrador', 'Control de Estudios', 'Coordinador'), validateCrearRepresentante, RepresentanteController.crear);
representanteRoutes.patch('/:id', authorize('Administrador', 'Control de Estudios', 'Coordinador'), RepresentanteController.actualizar);
representanteRoutes.delete('/:id', authorize('Administrador'), RepresentanteController.eliminar);
