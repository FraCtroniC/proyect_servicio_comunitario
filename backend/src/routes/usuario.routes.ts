import { Router } from 'express';
import { UsuarioController } from '../controllers/usuario.controller';
import { validateCrearUsuario } from '../validators/usuario.validator';

export const usuarioRoutes = Router();

usuarioRoutes.get('/', UsuarioController.listar);
usuarioRoutes.get('/:id', UsuarioController.obtenerPorId);
usuarioRoutes.post('/', validateCrearUsuario, UsuarioController.crear);
usuarioRoutes.patch('/:id', UsuarioController.actualizar);
usuarioRoutes.delete('/:id', UsuarioController.eliminar);
