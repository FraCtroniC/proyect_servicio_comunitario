import { Router } from 'express';
import { SeccionController } from '../controllers/seccion.controller';

export const seccionRoutes = Router();

seccionRoutes.get('/', SeccionController.listar);
seccionRoutes.get('/:id', SeccionController.obtenerPorId);
seccionRoutes.post('/', SeccionController.crear);
seccionRoutes.patch('/:id', SeccionController.actualizar);
seccionRoutes.delete('/:id', SeccionController.eliminar);
