import { Router } from 'express';
import { RolController } from '../controllers/rol.controller';

export const rolRoutes = Router();

rolRoutes.get('/', RolController.listar);
rolRoutes.get('/:id', RolController.obtenerPorId);
rolRoutes.post('/', RolController.crear);
rolRoutes.patch('/:id', RolController.actualizar);
rolRoutes.delete('/:id', RolController.eliminar);
