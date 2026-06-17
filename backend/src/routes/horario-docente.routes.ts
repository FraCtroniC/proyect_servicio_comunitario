import { Router } from 'express';
import { HorarioDocenteController } from '../controllers/horario-docente.controller';

export const horarioDocenteRoutes = Router();

horarioDocenteRoutes.get('/', HorarioDocenteController.listar);
horarioDocenteRoutes.get('/:id', HorarioDocenteController.obtenerPorId);
horarioDocenteRoutes.post('/', HorarioDocenteController.crear);
horarioDocenteRoutes.patch('/:id', HorarioDocenteController.actualizar);
horarioDocenteRoutes.delete('/:id', HorarioDocenteController.eliminar);
