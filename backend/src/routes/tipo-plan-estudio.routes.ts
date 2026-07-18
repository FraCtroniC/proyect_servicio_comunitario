import { Router } from 'express';
import { TipoPlanEstudioController } from '../controllers/tipo-plan-estudio.controller';
import { authorize } from '../middlewares/rbac.middleware';

export const tipoPlanEstudioRoutes = Router();

tipoPlanEstudioRoutes.get('/', authorize('Administrador', 'Control de Estudios', 'Coordinador', 'Docente'), TipoPlanEstudioController.listar);
tipoPlanEstudioRoutes.post('/', authorize('Administrador', 'Control de Estudios'), TipoPlanEstudioController.crear);
tipoPlanEstudioRoutes.delete('/:id', authorize('Administrador', 'Control de Estudios'), TipoPlanEstudioController.eliminar);
