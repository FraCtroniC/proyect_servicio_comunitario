import { Router } from 'express';
import { HorarioDocenteController } from '../controllers/horario-docente.controller';
import { authorize } from '../middlewares/rbac.middleware';
import { cacheable, invalidates } from '../middlewares/cache.middleware';

export const horarioDocenteRoutes = Router();

horarioDocenteRoutes.get('/', cacheable({ ttl: 600 }), HorarioDocenteController.listar);
horarioDocenteRoutes.get('/:id', cacheable({ ttl: 600 }), HorarioDocenteController.obtenerPorId);
horarioDocenteRoutes.post('/', authorize('Administrador', 'Control de Estudios', 'Coordinador'), invalidates('horarios:*'), HorarioDocenteController.crear);
horarioDocenteRoutes.patch('/:id', authorize('Administrador', 'Control de Estudios', 'Coordinador'), invalidates('horarios:*'), HorarioDocenteController.actualizar);
horarioDocenteRoutes.delete('/:id', authorize('Administrador'), invalidates('horarios:*'), HorarioDocenteController.eliminar);
