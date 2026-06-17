import { Router } from 'express';
import { PlanEstudioController } from '../controllers/plan-estudio.controller';

export const planEstudioRoutes = Router();

planEstudioRoutes.get('/', PlanEstudioController.listar);
planEstudioRoutes.get('/:id', PlanEstudioController.obtenerPorId);
planEstudioRoutes.post('/', PlanEstudioController.crear);
planEstudioRoutes.patch('/:id', PlanEstudioController.actualizar);
planEstudioRoutes.delete('/:id', PlanEstudioController.eliminar);
