import { Router } from 'express';
import { UsuarioController } from '../controllers/usuario.controller';
import { validateCrearUsuario } from '../validators/usuario.validator';
import { authorize } from '../middlewares/rbac.middleware';
import { cacheable, invalidates } from '../middlewares/cache.middleware';

export const usuarioRoutes = Router();

usuarioRoutes.get('/', cacheable({ ttl: 600 }), UsuarioController.listar);
usuarioRoutes.get('/:id', cacheable({ ttl: 600 }), UsuarioController.obtenerPorId);
usuarioRoutes.post('/', authorize('Administrador', 'Control de Estudios', 'Coordinador'), validateCrearUsuario, invalidates('usuarios:*'), UsuarioController.crear);
usuarioRoutes.patch('/:id', authorize('Administrador'), invalidates('usuarios:*'), UsuarioController.actualizar);
usuarioRoutes.delete('/:id', authorize('Administrador'), invalidates('usuarios:*'), UsuarioController.eliminar);
