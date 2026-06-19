import { Router } from 'express';
import { EstudianteController } from '../controllers/estudiante.controller';
import { validateCrearEstudiante } from '../validators/estudiante.validator';
import { authorize } from '../middlewares/rbac.middleware';

export const estudianteRoutes = Router();

estudianteRoutes.get('/', EstudianteController.listar);
estudianteRoutes.get('/:id', EstudianteController.obtenerPorId);
estudianteRoutes.post('/', authorize(1, 3), validateCrearEstudiante, EstudianteController.crear);
estudianteRoutes.patch('/:id', EstudianteController.actualizar);
estudianteRoutes.delete('/:id', authorize(1), EstudianteController.eliminar);
