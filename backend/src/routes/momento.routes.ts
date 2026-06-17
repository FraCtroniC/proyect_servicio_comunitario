import { Router } from 'express';
import { MomentoController } from '../controllers/momento.controller';

export const momentoRoutes = Router();

momentoRoutes.get('/', MomentoController.listar);
momentoRoutes.get('/:id', MomentoController.obtenerPorId);
momentoRoutes.post('/', MomentoController.crear);
momentoRoutes.patch('/:id', MomentoController.actualizar);
momentoRoutes.delete('/:id', MomentoController.eliminar);
