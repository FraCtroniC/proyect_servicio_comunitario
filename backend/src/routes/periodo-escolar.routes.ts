import { Router } from 'express';
import { PeriodoEscolarController } from '../controllers/periodo-escolar.controller';
import { validateCrearPeriodoEscolar } from '../validators/periodo-escolar.validator';
import { authorize } from '../middlewares/rbac.middleware';

export const periodoEscolarRoutes = Router();

periodoEscolarRoutes.get('/', PeriodoEscolarController.listar);
periodoEscolarRoutes.get('/:id', PeriodoEscolarController.obtenerPorId);
periodoEscolarRoutes.post('/', authorize(1, 3), validateCrearPeriodoEscolar, PeriodoEscolarController.crear);
periodoEscolarRoutes.patch('/:id', authorize(1, 3), PeriodoEscolarController.actualizar);
periodoEscolarRoutes.delete('/:id', authorize(1), PeriodoEscolarController.eliminar);
