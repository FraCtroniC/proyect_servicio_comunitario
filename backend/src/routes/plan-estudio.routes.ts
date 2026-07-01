import { Router } from 'express';
import { PlanEstudioController } from '../controllers/plan-estudio.controller';
import { validateCrearPlanEstudio } from '../validators/plan-estudio.validator';
import { authorize } from '../middlewares/rbac.middleware';

export const planEstudioRoutes = Router();

planEstudioRoutes.get('/', PlanEstudioController.listar);
planEstudioRoutes.get('/:id', PlanEstudioController.obtenerPorId);
planEstudioRoutes.post('/', authorize('Administrador', 'Control de Estudios', 'Coordinador'), validateCrearPlanEstudio, PlanEstudioController.crear);
planEstudioRoutes.patch('/:id', authorize('Administrador', 'Control de Estudios', 'Coordinador'), PlanEstudioController.actualizar);
planEstudioRoutes.delete('/:id', authorize('Administrador'), PlanEstudioController.eliminar);
