import { Router } from 'express';
import { HorarioDocenteController } from '../controllers/horario-docente.controller';
import { authorize } from '../middlewares/rbac.middleware';

export const horarioDocenteRoutes = Router();

horarioDocenteRoutes.get('/', HorarioDocenteController.listar);
horarioDocenteRoutes.get('/:id', HorarioDocenteController.obtenerPorId);
horarioDocenteRoutes.post('/', authorize(1, 3), HorarioDocenteController.crear);
horarioDocenteRoutes.patch('/:id', HorarioDocenteController.actualizar);
horarioDocenteRoutes.delete('/:id', authorize(1), HorarioDocenteController.eliminar);
