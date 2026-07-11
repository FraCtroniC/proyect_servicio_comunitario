import { Router } from 'express';
import { AsignaturaController } from '../controllers/asignatura.controller';
import { validateCrearAsignatura } from '../validators/asignatura.validator';
import { authorize } from '../middlewares/rbac.middleware';
import { cacheable, invalidates } from '../middlewares/cache.middleware';

export const asignaturaRoutes = Router();

asignaturaRoutes.get('/', cacheable({ ttl: 3600 }), AsignaturaController.listar);
asignaturaRoutes.get('/:id', cacheable({ ttl: 3600 }), AsignaturaController.obtenerPorId);
asignaturaRoutes.post('/', authorize('Administrador', 'Control de Estudios', 'Coordinador'), validateCrearAsignatura, invalidates('asignaturas:*'), AsignaturaController.crear);
asignaturaRoutes.patch('/:id', authorize('Administrador', 'Control de Estudios', 'Coordinador'), invalidates('asignaturas:*'), AsignaturaController.actualizar);
asignaturaRoutes.delete('/:id', authorize('Administrador'), invalidates('asignaturas:*'), AsignaturaController.eliminar);
