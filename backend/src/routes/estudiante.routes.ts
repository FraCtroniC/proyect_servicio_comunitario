import { Router } from 'express';
import { EstudianteController } from '../controllers/estudiante.controller';
import { validateCrearEstudiante, validateAgeByGrade } from '../validators/estudiante.validator';
import { authorize } from '../middlewares/rbac.middleware';

export const estudianteRoutes = Router();

estudianteRoutes.get('/', EstudianteController.listar);
estudianteRoutes.get('/:id', EstudianteController.obtenerPorId);
estudianteRoutes.post('/', authorize('Administrador', 'Control de Estudios', 'Coordinador'), validateCrearEstudiante, validateAgeByGrade, EstudianteController.crear);
estudianteRoutes.patch('/:id', authorize('Administrador', 'Control de Estudios', 'Coordinador'), EstudianteController.actualizar);
estudianteRoutes.delete('/:id', authorize('Administrador'), EstudianteController.eliminar);
