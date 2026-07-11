import { Router } from 'express';
import { BloqueHorarioController } from '../controllers/bloque-horario.controller';
import { authorize } from '../middlewares/rbac.middleware';
import { cacheable, invalidates } from '../middlewares/cache.middleware';

export const bloqueHorarioRoutes = Router();

bloqueHorarioRoutes.get('/', cacheable({ ttl: 7200 }), BloqueHorarioController.listar);
bloqueHorarioRoutes.get('/:id', cacheable({ ttl: 7200 }), BloqueHorarioController.obtenerPorId);
bloqueHorarioRoutes.post('/', authorize('Administrador', 'Control de Estudios', 'Coordinador'), invalidates('bloques:*'), BloqueHorarioController.crear);
bloqueHorarioRoutes.patch('/:id', authorize('Administrador', 'Control de Estudios', 'Coordinador'), invalidates('bloques:*'), BloqueHorarioController.actualizar);
bloqueHorarioRoutes.delete('/:id', authorize('Administrador'), invalidates('bloques:*'), BloqueHorarioController.eliminar);
