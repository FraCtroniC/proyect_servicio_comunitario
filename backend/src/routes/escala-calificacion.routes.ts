import { Router } from 'express';
import { EscalaCalificacionController } from '../controllers/escala-calificacion.controller';
import { authorize } from '../middlewares/rbac.middleware';

export const escalaCalificacionRoutes = Router();

escalaCalificacionRoutes.get('/', EscalaCalificacionController.listar);
escalaCalificacionRoutes.get('/:id', EscalaCalificacionController.obtenerPorId);
escalaCalificacionRoutes.post('/', authorize('Administrador', 'Control de Estudios', 'Docente'), EscalaCalificacionController.crear);
escalaCalificacionRoutes.patch('/:id', authorize('Administrador', 'Control de Estudios', 'Docente'), EscalaCalificacionController.actualizar);
escalaCalificacionRoutes.delete('/:id', authorize('Administrador'), EscalaCalificacionController.eliminar);
