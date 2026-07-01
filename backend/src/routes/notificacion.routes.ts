import { Router } from 'express';
import { NotificacionController } from '../controllers/notificacion.controller';
import { authorize } from '../middlewares/rbac.middleware';

export const notificacionRoutes = Router();

// Only admin/control_estudios should send these alerts
notificacionRoutes.post('/alerta-academica', authorize('Administrador', 'Control de Estudios', 'Coordinador', 'Docente'), NotificacionController.alertaAcademica);
