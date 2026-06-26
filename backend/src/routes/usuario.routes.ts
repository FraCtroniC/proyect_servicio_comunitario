import { Router } from 'express';
import { UsuarioController } from '../controllers/usuario.controller';
import { validateCrearUsuario } from '../validators/usuario.validator';
import { authorize } from '../middlewares/rbac.middleware';

export const usuarioRoutes = Router();

usuarioRoutes.get('/', UsuarioController.listar);
usuarioRoutes.get('/:id', UsuarioController.obtenerPorId);
usuarioRoutes.post('/', authorize(1, 3), validateCrearUsuario, UsuarioController.crear);
usuarioRoutes.patch('/:id', authorize(1), UsuarioController.actualizar);
usuarioRoutes.delete('/:id', authorize(1), UsuarioController.eliminar);
