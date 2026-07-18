import { Router } from 'express';
import { AsignaturaController } from '../controllers/asignatura.controller';
import { validateCrearAsignatura } from '../validators/asignatura.validator';
import { authorize } from '../middlewares/rbac.middleware';

export const asignaturaRoutes = Router();

asignaturaRoutes.get('/', AsignaturaController.listar);
asignaturaRoutes.get('/:id', AsignaturaController.obtenerPorId);
asignaturaRoutes.post('/', authorize('Administrador', 'Control de Estudios', 'Coordinador'), validateCrearAsignatura, AsignaturaController.crear);
asignaturaRoutes.patch('/:id', authorize('Administrador', 'Control de Estudios', 'Coordinador'), AsignaturaController.actualizar);
asignaturaRoutes.delete('/:id', authorize('Administrador'), AsignaturaController.eliminar);
