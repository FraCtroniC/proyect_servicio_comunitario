import { Router } from 'express';
import { PlanEstudioController } from '../controllers/plan-estudio.controller';
import { validateCrearPlanEstudio, validateActualizarPlanEstudio } from '../validators/plan-estudio.validator';
import { authorize } from '../middlewares/rbac.middleware';

export const planEstudioRoutes = Router();

planEstudioRoutes.get('/', PlanEstudioController.listar);
planEstudioRoutes.get('/:id', PlanEstudioController.obtenerPorId);
planEstudioRoutes.post('/', authorize('Administrador', 'Control de Estudios', 'Docente'), validateCrearPlanEstudio, PlanEstudioController.crear);
planEstudioRoutes.patch('/:id', authorize('Administrador', 'Control de Estudios', 'Docente'), validateActualizarPlanEstudio, PlanEstudioController.actualizar);
planEstudioRoutes.delete('/:id', authorize('Administrador'), PlanEstudioController.eliminar);
