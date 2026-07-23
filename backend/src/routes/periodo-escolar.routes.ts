import { Router } from 'express';
import { PeriodoEscolarController } from '../controllers/periodo-escolar.controller';
import { validateCrearPeriodoEscolar } from '../validators/periodo-escolar.validator';
import { authorize } from '../middlewares/rbac.middleware';

export const periodoEscolarRoutes = Router();

periodoEscolarRoutes.get('/', PeriodoEscolarController.listar);
periodoEscolarRoutes.get('/:id', PeriodoEscolarController.obtenerPorId);
periodoEscolarRoutes.get('/:id/promocion-preview', authorize('Administrador', 'Control de Estudios'), PeriodoEscolarController.promocionPreview);
periodoEscolarRoutes.post('/', authorize('Administrador', 'Control de Estudios'), validateCrearPeriodoEscolar, PeriodoEscolarController.crear);
periodoEscolarRoutes.post('/:id/cierre-anual', authorize('Administrador', 'Control de Estudios'), PeriodoEscolarController.cierreAnual);
periodoEscolarRoutes.post('/:id/promocion-confirmar', authorize('Administrador', 'Control de Estudios'), PeriodoEscolarController.promocionConfirmar);
periodoEscolarRoutes.patch('/:id', authorize('Administrador', 'Control de Estudios'), PeriodoEscolarController.actualizar);
periodoEscolarRoutes.delete('/:id', authorize('Administrador'), PeriodoEscolarController.eliminar);
