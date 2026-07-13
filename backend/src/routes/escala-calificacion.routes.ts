import { Router } from 'express';
import { EscalaCalificacionController } from '../controllers/escala-calificacion.controller';
import { authorize } from '../middlewares/rbac.middleware';
import { cacheable, invalidates } from '../middlewares/cache.middleware';

export const escalaCalificacionRoutes = Router();

escalaCalificacionRoutes.get('/', cacheable({ ttl: 3600 }), EscalaCalificacionController.listar);
escalaCalificacionRoutes.get('/:id', cacheable({ ttl: 3600 }), EscalaCalificacionController.obtenerPorId);
escalaCalificacionRoutes.post('/', authorize('Administrador', 'Control de Estudios', 'Docente'), invalidates('escalas:*'), EscalaCalificacionController.crear);
escalaCalificacionRoutes.patch('/:id', authorize('Administrador', 'Control de Estudios', 'Docente'), invalidates('escalas:*'), EscalaCalificacionController.actualizar);
escalaCalificacionRoutes.delete('/:id', authorize('Administrador'), invalidates('escalas:*'), EscalaCalificacionController.eliminar);
