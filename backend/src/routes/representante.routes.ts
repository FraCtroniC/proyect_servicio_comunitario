import { Router } from 'express';
import { RepresentanteController } from '../controllers/representante.controller';

export const representanteRoutes = Router();

representanteRoutes.get('/', RepresentanteController.listar);
representanteRoutes.get('/:id', RepresentanteController.obtenerPorId);
representanteRoutes.post('/', RepresentanteController.crear);
representanteRoutes.patch('/:id', RepresentanteController.actualizar);
representanteRoutes.delete('/:id', RepresentanteController.eliminar);
