import { Router } from 'express';
import { BloqueHorarioController } from '../controllers/bloque-horario.controller';
import { authorize } from '../middlewares/rbac.middleware';

export const bloqueHorarioRoutes = Router();

bloqueHorarioRoutes.get('/', BloqueHorarioController.listar);
bloqueHorarioRoutes.get('/:id', BloqueHorarioController.obtenerPorId);
bloqueHorarioRoutes.post('/', authorize(1, 3), BloqueHorarioController.crear);
bloqueHorarioRoutes.patch('/:id', authorize(1, 3), BloqueHorarioController.actualizar);
bloqueHorarioRoutes.delete('/:id', authorize(1), BloqueHorarioController.eliminar);
