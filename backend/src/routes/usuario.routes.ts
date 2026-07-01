import { Router } from 'express';
import { UsuarioController } from '../controllers/usuario.controller';
import { validateCrearUsuario } from '../validators/usuario.validator';
import { authorize } from '../middlewares/rbac.middleware';

export const usuarioRoutes = Router();

usuarioRoutes.get('/', UsuarioController.listar);
usuarioRoutes.get('/:id', UsuarioController.obtenerPorId);
usuarioRoutes.post('/', authorize('Administrador', 'Control de Estudios', 'Coordinador'), validateCrearUsuario, UsuarioController.crear);
usuarioRoutes.patch('/:id', authorize('Administrador'), UsuarioController.actualizar);
usuarioRoutes.delete('/:id', authorize('Administrador'), UsuarioController.eliminar);
