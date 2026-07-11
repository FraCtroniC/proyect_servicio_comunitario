import { Router } from 'express';
import { PeriodoEscolarController } from '../controllers/periodo-escolar.controller';
import { validateCrearPeriodoEscolar } from '../validators/periodo-escolar.validator';
import { authorize } from '../middlewares/rbac.middleware';
import { cacheable, invalidates } from '../middlewares/cache.middleware';

export const periodoEscolarRoutes = Router();

periodoEscolarRoutes.get('/', cacheable({ ttl: 3600 }), PeriodoEscolarController.listar);
periodoEscolarRoutes.get('/:id', cacheable({ ttl: 3600 }), PeriodoEscolarController.obtenerPorId);
periodoEscolarRoutes.post('/', authorize('Administrador', 'Control de Estudios'), validateCrearPeriodoEscolar, invalidates('periodos:*'), PeriodoEscolarController.crear);
periodoEscolarRoutes.patch('/:id', authorize('Administrador', 'Control de Estudios'), invalidates('periodos:*'), PeriodoEscolarController.actualizar);
periodoEscolarRoutes.delete('/:id', authorize('Administrador'), invalidates('periodos:*'), PeriodoEscolarController.eliminar);
