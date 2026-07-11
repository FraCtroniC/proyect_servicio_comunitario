import { Router } from 'express';
import { DiaSemanaController } from '../controllers/dia-semana.controller';
import { authorize } from '../middlewares/rbac.middleware';
import { cacheable, invalidates } from '../middlewares/cache.middleware';

export const diaSemanaRoutes = Router();

diaSemanaRoutes.get('/', cacheable({ ttl: 7200 }), DiaSemanaController.listar);
diaSemanaRoutes.get('/:id', cacheable({ ttl: 7200 }), DiaSemanaController.obtenerPorId);
diaSemanaRoutes.post('/', authorize('Administrador', 'Control de Estudios', 'Coordinador'), invalidates('dias:*'), DiaSemanaController.crear);
diaSemanaRoutes.patch('/:id', authorize('Administrador', 'Control de Estudios', 'Coordinador'), invalidates('dias:*'), DiaSemanaController.actualizar);
diaSemanaRoutes.delete('/:id', authorize('Administrador'), invalidates('dias:*'), DiaSemanaController.eliminar);
