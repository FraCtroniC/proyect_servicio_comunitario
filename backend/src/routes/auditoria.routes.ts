import { Router } from 'express';
import { AuditoriaController } from '../controllers/auditoria.controller';
import { authorize } from '../middlewares/rbac.middleware';

export const auditoriaRoutes = Router();

auditoriaRoutes.get('/', authorize(1), AuditoriaController.listar);
auditoriaRoutes.get('/:id', authorize(1), AuditoriaController.obtenerPorId);
auditoriaRoutes.post('/', authorize(1), AuditoriaController.crear);
auditoriaRoutes.patch('/:id', authorize(1), AuditoriaController.actualizar);
auditoriaRoutes.delete('/:id', authorize(1), AuditoriaController.eliminar);
