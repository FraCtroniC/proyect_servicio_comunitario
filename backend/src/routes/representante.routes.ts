import { Router } from 'express';
import { RepresentanteController } from '../controllers/representante.controller';
import { validateCrearRepresentante } from '../validators/representante.validator';
import { authorize } from '../middlewares/rbac.middleware';

export const representanteRoutes = Router();

representanteRoutes.get('/', RepresentanteController.listar);
representanteRoutes.get('/:id', RepresentanteController.obtenerPorId);
representanteRoutes.post('/', authorize(1, 3), validateCrearRepresentante, RepresentanteController.crear);
representanteRoutes.patch('/:id', RepresentanteController.actualizar);
representanteRoutes.delete('/:id', authorize(1), RepresentanteController.eliminar);
