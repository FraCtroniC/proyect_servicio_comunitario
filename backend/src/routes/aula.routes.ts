import { Router } from 'express';
import { AulaController } from '../controllers/aula.controller';
import { validateCrearAula } from '../validators/aula.validator';
import { authorize } from '../middlewares/rbac.middleware';

export const aulaRoutes = Router();

aulaRoutes.get('/', AulaController.listar);
aulaRoutes.get('/:id', AulaController.obtenerPorId);
aulaRoutes.post('/', authorize('Administrador', 'Control de Estudios'), validateCrearAula, AulaController.crear);
aulaRoutes.patch('/:id', authorize('Administrador', 'Control de Estudios'), AulaController.actualizar);
aulaRoutes.delete('/:id', authorize('Administrador'), AulaController.eliminar);
