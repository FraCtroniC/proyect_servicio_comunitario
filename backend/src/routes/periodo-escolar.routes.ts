import { Router } from 'express';
import { PeriodoEscolarController } from '../controllers/periodo-escolar.controller';

export const periodoEscolarRoutes = Router();

periodoEscolarRoutes.get('/', PeriodoEscolarController.listar);
periodoEscolarRoutes.get('/:id', PeriodoEscolarController.obtenerPorId);
periodoEscolarRoutes.post('/', PeriodoEscolarController.crear);
periodoEscolarRoutes.patch('/:id', PeriodoEscolarController.actualizar);
periodoEscolarRoutes.delete('/:id', PeriodoEscolarController.eliminar);
