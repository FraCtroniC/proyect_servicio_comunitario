import { Router } from 'express';
import { MomentoController } from '../controllers/momento.controller';
import { validateCrearMomento } from '../validators/momento.validator';
import { authorize } from '../middlewares/rbac.middleware';

export const momentoRoutes = Router();

momentoRoutes.get('/', MomentoController.listar);
momentoRoutes.get('/:id', MomentoController.obtenerPorId);
momentoRoutes.post('/', authorize('Administrador', 'Control de Estudios', 'Docente'), validateCrearMomento, MomentoController.crear);
momentoRoutes.patch('/:id', authorize('Administrador', 'Control de Estudios', 'Docente'), MomentoController.actualizar);
momentoRoutes.delete('/:id', authorize('Administrador'), MomentoController.eliminar);
