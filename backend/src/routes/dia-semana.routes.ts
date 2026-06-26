import { Router } from 'express';
import { DiaSemanaController } from '../controllers/dia-semana.controller';
import { authorize } from '../middlewares/rbac.middleware';

export const diaSemanaRoutes = Router();

diaSemanaRoutes.get('/', DiaSemanaController.listar);
diaSemanaRoutes.get('/:id', DiaSemanaController.obtenerPorId);
diaSemanaRoutes.post('/', authorize(1, 3), DiaSemanaController.crear);
diaSemanaRoutes.patch('/:id', authorize(1, 3), DiaSemanaController.actualizar);
diaSemanaRoutes.delete('/:id', authorize(1), DiaSemanaController.eliminar);
