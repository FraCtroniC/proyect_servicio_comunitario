import { Router } from 'express';
import { BloqueHorarioController } from '../controllers/bloque-horario.controller';

export const bloqueHorarioRoutes = Router();

bloqueHorarioRoutes.get('/', BloqueHorarioController.listar);
bloqueHorarioRoutes.get('/:id', BloqueHorarioController.obtenerPorId);
bloqueHorarioRoutes.post('/', BloqueHorarioController.crear);
bloqueHorarioRoutes.patch('/:id', BloqueHorarioController.actualizar);
bloqueHorarioRoutes.delete('/:id', BloqueHorarioController.eliminar);
