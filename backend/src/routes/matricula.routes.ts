import { Router } from 'express';
import { MatriculaController } from '../controllers/matricula.controller';
import { validateCrearMatricula } from '../validators/matricula.validator';
import { authorize } from '../middlewares/rbac.middleware';

export const matriculaRoutes = Router();

matriculaRoutes.get('/', MatriculaController.listar);
matriculaRoutes.get('/:id', MatriculaController.obtenerPorId);
matriculaRoutes.post('/', authorize('Administrador', 'Control de Estudios', 'Coordinador'), validateCrearMatricula, MatriculaController.crear);
matriculaRoutes.patch('/:id', authorize('Administrador', 'Control de Estudios', 'Coordinador'), MatriculaController.actualizar);
matriculaRoutes.delete('/:id', authorize('Administrador'), MatriculaController.eliminar);
