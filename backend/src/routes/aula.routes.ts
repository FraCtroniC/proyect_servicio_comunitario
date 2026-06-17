import { Router } from 'express';
import { AulaController } from '../controllers/aula.controller';

export const aulaRoutes = Router();

aulaRoutes.get('/', AulaController.listar);
aulaRoutes.get('/:id', AulaController.obtenerPorId);
aulaRoutes.post('/', AulaController.crear);
aulaRoutes.patch('/:id', AulaController.actualizar);
aulaRoutes.delete('/:id', AulaController.eliminar);
