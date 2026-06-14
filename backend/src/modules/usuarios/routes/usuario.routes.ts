import { Router } from 'express';
import { UsuarioController } from '../controllers';

export const usuarioRoutes = Router();

usuarioRoutes.get('/', UsuarioController.listar);
usuarioRoutes.get('/:id', UsuarioController.obtenerPorId);
usuarioRoutes.post('/', UsuarioController.crear);
usuarioRoutes.patch('/:id', UsuarioController.actualizar);
usuarioRoutes.delete('/:id', UsuarioController.eliminar);
