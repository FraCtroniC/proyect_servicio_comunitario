import { Router } from 'express';
import { DiaSemanaController } from '../controllers/dia-semana.controller';
import { authorize } from '../middlewares/rbac.middleware';

export const diaSemanaRoutes = Router();

diaSemanaRoutes.get('/', DiaSemanaController.listar);
diaSemanaRoutes.get('/:id', DiaSemanaController.obtenerPorId);
diaSemanaRoutes.post('/', authorize('Administrador', 'Control de Estudios', 'Coordinador'), DiaSemanaController.crear);
diaSemanaRoutes.patch('/:id', authorize('Administrador', 'Control de Estudios', 'Coordinador'), DiaSemanaController.actualizar);
diaSemanaRoutes.delete('/:id', authorize('Administrador'), DiaSemanaController.eliminar);
