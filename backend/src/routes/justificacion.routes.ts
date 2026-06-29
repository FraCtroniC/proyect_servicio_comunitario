import { Router } from 'express';
import { JustificacionController } from '../controllers/justificacion.controller';
import { authorize } from '../middlewares/rbac.middleware';
import { ROLES } from '../shared/constants';

export const justificacionRoutes = Router();

justificacionRoutes.get('/', JustificacionController.listar);
justificacionRoutes.get('/por-asistencia/:id_asistencia', JustificacionController.listarPorAsistencia);
justificacionRoutes.get('/:id', JustificacionController.obtenerPorId);
justificacionRoutes.post('/', authorize(ROLES.SUPER_ADMIN, ROLES.CONTROL_ESTUDIOS, ROLES.DOCENTE), JustificacionController.crear);
justificacionRoutes.patch('/:id', authorize(ROLES.SUPER_ADMIN, ROLES.CONTROL_ESTUDIOS), JustificacionController.actualizar);
justificacionRoutes.delete('/:id', authorize(ROLES.SUPER_ADMIN), JustificacionController.eliminar);
