import { Router } from 'express';
import { PlanEstudioController } from '../controllers/plan-estudio.controller';
import { validateCrearPlanEstudio } from '../validators/plan-estudio.validator';
import { authorize } from '../middlewares/rbac.middleware';

export const planEstudioRoutes = Router();

planEstudioRoutes.get('/', PlanEstudioController.listar);
planEstudioRoutes.get('/:id', PlanEstudioController.obtenerPorId);
planEstudioRoutes.post('/', authorize(1, 3), validateCrearPlanEstudio, PlanEstudioController.crear);
planEstudioRoutes.patch('/:id', PlanEstudioController.actualizar);
planEstudioRoutes.delete('/:id', authorize(1), PlanEstudioController.eliminar);
