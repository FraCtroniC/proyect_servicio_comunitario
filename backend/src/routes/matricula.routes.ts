import { Router } from 'express';
import { MatriculaController } from '../controllers/matricula.controller';
import { validateCrearMatricula } from '../validators/matricula.validator';
import { authorize } from '../middlewares/rbac.middleware';

export const matriculaRoutes = Router();

matriculaRoutes.get('/', MatriculaController.listar);
matriculaRoutes.get('/:id', MatriculaController.obtenerPorId);
matriculaRoutes.post('/', authorize(1, 3), validateCrearMatricula, MatriculaController.crear);
matriculaRoutes.patch('/:id', MatriculaController.actualizar);
matriculaRoutes.delete('/:id', authorize(1), MatriculaController.eliminar);
