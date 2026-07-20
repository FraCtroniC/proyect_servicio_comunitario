import { Router } from 'express';
import { FormatoSabanaController } from '../controllers/formato-sabana.controller';
import { authorize } from '../middlewares/rbac.middleware';

export const formatoSabanaRoutes = Router();

// Obtener formato activo (todos los roles autenticados pueden ver)
formatoSabanaRoutes.get('/activo', FormatoSabanaController.obtenerActivo);

// Listar todos los formatos
formatoSabanaRoutes.get('/', FormatoSabanaController.listar);

// Obtener formato por ID
formatoSabanaRoutes.get('/:id', FormatoSabanaController.obtenerPorId);

// Crear formato (solo Admin)
formatoSabanaRoutes.post('/', authorize('Administrador', 'Control de Estudios'), FormatoSabanaController.crear);

// Actualizar formato (Admin y Control de Estudios)
formatoSabanaRoutes.put('/:id', authorize('Administrador', 'Control de Estudios'), FormatoSabanaController.actualizar);

// Eliminar formato (solo Admin)
formatoSabanaRoutes.delete('/:id', authorize('Administrador'), FormatoSabanaController.eliminar);

// Activar formato (Admin y Control de Estudios)
formatoSabanaRoutes.put('/:id/activar', authorize('Administrador', 'Control de Estudios'), FormatoSabanaController.activar);
