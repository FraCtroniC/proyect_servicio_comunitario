import { Router } from 'express';
import { PeriodoEscolarController } from '../controllers/periodo-escolar.controller';
import { validateCrearPeriodoEscolar } from '../validators/periodo-escolar.validator';
import { authorize } from '../middlewares/rbac.middleware';

export const periodoEscolarRoutes = Router();

periodoEscolarRoutes.get('/', PeriodoEscolarController.listar);
periodoEscolarRoutes.get('/:id', PeriodoEscolarController.obtenerPorId);
periodoEscolarRoutes.post('/', authorize('Administrador', 'Control de Estudios'), validateCrearPeriodoEscolar, PeriodoEscolarController.crear);
periodoEscolarRoutes.patch('/:id', authorize('Administrador', 'Control de Estudios'), PeriodoEscolarController.actualizar);
periodoEscolarRoutes.delete('/:id', authorize('Administrador'), PeriodoEscolarController.eliminar);
