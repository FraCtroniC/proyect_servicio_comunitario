import { Router } from 'express';
import { AsignaturaController } from '../controllers/asignatura.controller';
import { validateCrearAsignatura } from '../validators/asignatura.validator';
import { authorize } from '../middlewares/rbac.middleware';

export const asignaturaRoutes = Router();

asignaturaRoutes.get('/', AsignaturaController.listar);
asignaturaRoutes.get('/:id', AsignaturaController.obtenerPorId);
asignaturaRoutes.post('/', authorize(1, 3), validateCrearAsignatura, AsignaturaController.crear);
asignaturaRoutes.patch('/:id', authorize(1, 3), AsignaturaController.actualizar);
asignaturaRoutes.delete('/:id', authorize(1), AsignaturaController.eliminar);
