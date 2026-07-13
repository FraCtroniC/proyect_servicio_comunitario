import { Router } from 'express';
import { AuditoriaController } from '../controllers/auditoria.controller';
import { authorize } from '../middlewares/rbac.middleware';

export const auditoriaRoutes = Router();

auditoriaRoutes.get('/', authorize('Administrador', 'Control de Estudios', 'Docente'), AuditoriaController.listar);
auditoriaRoutes.get('/:id', authorize('Administrador', 'Control de Estudios', 'Docente'), AuditoriaController.obtenerPorId);
auditoriaRoutes.post('/', authorize('Administrador', 'Control de Estudios', 'Docente'), AuditoriaController.crear);
auditoriaRoutes.patch('/:id', authorize('Administrador'), AuditoriaController.actualizar);
auditoriaRoutes.delete('/:id', authorize('Administrador'), AuditoriaController.eliminar);
