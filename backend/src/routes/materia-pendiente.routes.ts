import { Router } from 'express';
import { MateriaPendienteController } from '../controllers/materia-pendiente.controller';
import { authorize } from '../middlewares/rbac.middleware';

export const materiaPendienteRoutes = Router();

materiaPendienteRoutes.get('/', authorize('Administrador', 'Control de Estudios', 'Coordinador', 'Docente'), MateriaPendienteController.getAll);
materiaPendienteRoutes.get('/estudiante/:id_estudiante', MateriaPendienteController.getByStudent);
materiaPendienteRoutes.post('/', authorize('Administrador', 'Control de Estudios', 'Coordinador', 'Docente'), MateriaPendienteController.create);
materiaPendienteRoutes.patch('/:id', authorize('Administrador', 'Control de Estudios', 'Coordinador', 'Docente'), MateriaPendienteController.update);
