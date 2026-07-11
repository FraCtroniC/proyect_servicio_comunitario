import { Router } from 'express';
import { AulaController } from '../controllers/aula.controller';
import { validateCrearAula } from '../validators/aula.validator';
import { authorize } from '../middlewares/rbac.middleware';
import { cacheable, invalidates } from '../middlewares/cache.middleware';

export const aulaRoutes = Router();

aulaRoutes.get('/', cacheable({ ttl: 3600 }), AulaController.listar);
aulaRoutes.get('/:id', cacheable({ ttl: 3600 }), AulaController.obtenerPorId);
aulaRoutes.post('/', authorize('Administrador', 'Control de Estudios'), validateCrearAula, invalidates('aulas:*'), AulaController.crear);
aulaRoutes.patch('/:id', authorize('Administrador', 'Control de Estudios'), invalidates('aulas:*'), AulaController.actualizar);
aulaRoutes.delete('/:id', authorize('Administrador'), invalidates('aulas:*'), AulaController.eliminar);
