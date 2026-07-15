import { Router } from 'express';
import { HorarioDocenteController } from '../controllers/horario-docente.controller';
import { HorarioController } from '../controllers/horario.controller';
import { authorize } from '../middlewares/rbac.middleware';

export const horarioDocenteRoutes = Router();

horarioDocenteRoutes.get('/', HorarioDocenteController.listar);
horarioDocenteRoutes.get('/mi-horario', HorarioController.miHorario);
horarioDocenteRoutes.get('/disponibles', HorarioController.listarDisponibles);
horarioDocenteRoutes.get('/:id', HorarioDocenteController.obtenerPorId);
horarioDocenteRoutes.post('/', authorize('Administrador', 'Control de Estudios', 'Coordinador', 4, 7, 8), HorarioDocenteController.crear);
horarioDocenteRoutes.patch('/:id', authorize('Administrador', 'Control de Estudios', 'Coordinador', 4, 7, 8), HorarioDocenteController.actualizar);
horarioDocenteRoutes.delete('/:id', authorize('Administrador', 4), HorarioDocenteController.eliminar);
