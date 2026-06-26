import { Router } from 'express';
import { AulaController } from '../controllers/aula.controller';
import { validateCrearAula } from '../validators/aula.validator';
import { authorize } from '../middlewares/rbac.middleware';

export const aulaRoutes = Router();

aulaRoutes.get('/', AulaController.listar);
aulaRoutes.get('/:id', AulaController.obtenerPorId);
aulaRoutes.post('/', authorize(1, 3), validateCrearAula, AulaController.crear);
aulaRoutes.patch('/:id', authorize(1, 3), AulaController.actualizar);
aulaRoutes.delete('/:id', authorize(1), AulaController.eliminar);
