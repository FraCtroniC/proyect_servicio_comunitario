import { Router } from 'express';
import { DiaSemanaController } from '../controllers/dia-semana.controller';

export const diaSemanaRoutes = Router();

diaSemanaRoutes.get('/', DiaSemanaController.listar);
diaSemanaRoutes.get('/:id', DiaSemanaController.obtenerPorId);
diaSemanaRoutes.post('/', DiaSemanaController.crear);
diaSemanaRoutes.patch('/:id', DiaSemanaController.actualizar);
diaSemanaRoutes.delete('/:id', DiaSemanaController.eliminar);
