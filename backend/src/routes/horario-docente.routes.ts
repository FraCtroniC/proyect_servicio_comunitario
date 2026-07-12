import { Router } from 'express';
import { HorarioDocenteController } from '../controllers/horario-docente.controller';
import { authorize } from '../middlewares/rbac.middleware';

export const horarioDocenteRoutes = Router();

horarioDocenteRoutes.get('/', HorarioDocenteController.listar);
horarioDocenteRoutes.get('/:id', HorarioDocenteController.obtenerPorId);
horarioDocenteRoutes.post('/', authorize('Administrador', 'Control de Estudios', 'Coordinador'), HorarioDocenteController.crear);
horarioDocenteRoutes.patch('/:id', authorize('Administrador', 'Control de Estudios', 'Coordinador'), HorarioDocenteController.actualizar);
horarioDocenteRoutes.delete('/:id', authorize('Administrador'), HorarioDocenteController.eliminar);
