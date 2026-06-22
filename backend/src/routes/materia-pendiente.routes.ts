import { Router } from 'express';
import { MateriaPendienteController } from '../controllers/materia-pendiente.controller';
import { authorize } from '../middlewares/rbac.middleware';

export const materiaPendienteRoutes = Router();

materiaPendienteRoutes.get('/estudiante/:id_estudiante', MateriaPendienteController.getByStudent);
materiaPendienteRoutes.post('/', authorize(1, 3, 4), MateriaPendienteController.create);
materiaPendienteRoutes.patch('/:id', authorize(1, 3, 4), MateriaPendienteController.update);
