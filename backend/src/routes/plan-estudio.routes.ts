import { Router } from 'express';
import { PlanEstudioController } from '../controllers/plan-estudio.controller';
import { validateCrearPlanEstudio, validateActualizarPlanEstudio } from '../validators/plan-estudio.validator';
import { authorize } from '../middlewares/rbac.middleware';
import { cacheable, invalidates } from '../middlewares/cache.middleware';

export const planEstudioRoutes = Router();

planEstudioRoutes.get('/', cacheable({ ttl: 3600 }), PlanEstudioController.listar);
planEstudioRoutes.get('/:id', cacheable({ ttl: 3600 }), PlanEstudioController.obtenerPorId);
planEstudioRoutes.post('/', authorize('Administrador', 'Control de Estudios', 'Coordinador'), validateCrearPlanEstudio, invalidates('plan-estudio:*'), PlanEstudioController.crear);
planEstudioRoutes.patch('/:id', authorize('Administrador', 'Control de Estudios', 'Coordinador'), validateActualizarPlanEstudio, invalidates('plan-estudio:*'), PlanEstudioController.actualizar);
planEstudioRoutes.delete('/:id', authorize('Administrador'), invalidates('plan-estudio:*'), PlanEstudioController.eliminar);
