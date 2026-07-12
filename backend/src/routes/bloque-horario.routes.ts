import { Router } from 'express';
import { BloqueHorarioController } from '../controllers/bloque-horario.controller';
import { authorize } from '../middlewares/rbac.middleware';

export const bloqueHorarioRoutes = Router();

bloqueHorarioRoutes.get('/', BloqueHorarioController.listar);
bloqueHorarioRoutes.get('/:id', BloqueHorarioController.obtenerPorId);
bloqueHorarioRoutes.post('/', authorize('Administrador', 'Control de Estudios', 'Coordinador'), BloqueHorarioController.crear);
bloqueHorarioRoutes.patch('/:id', authorize('Administrador', 'Control de Estudios', 'Coordinador'), BloqueHorarioController.actualizar);
bloqueHorarioRoutes.delete('/:id', authorize('Administrador'), BloqueHorarioController.eliminar);
