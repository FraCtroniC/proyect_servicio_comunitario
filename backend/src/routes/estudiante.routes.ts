import { Router } from 'express';
import { EstudianteController } from '../controllers/estudiante.controller';
import { validateCrearEstudiante, validateAgeByGrade } from '../validators/estudiante.validator';
import { authorize } from '../middlewares/rbac.middleware';
import { cacheable, invalidates } from '../middlewares/cache.middleware';

export const estudianteRoutes = Router();

estudianteRoutes.get('/', cacheable({ ttl: 600 }), EstudianteController.listar);
estudianteRoutes.get('/:id', cacheable({ ttl: 600 }), EstudianteController.obtenerPorId);
estudianteRoutes.post('/', authorize('Administrador', 'Control de Estudios', 'Coordinador'), validateCrearEstudiante, validateAgeByGrade, invalidates('estudiantes:*'), EstudianteController.crear);
estudianteRoutes.patch('/:id', authorize('Administrador', 'Control de Estudios', 'Coordinador'), invalidates('estudiantes:*'), EstudianteController.actualizar);
estudianteRoutes.delete('/:id', authorize('Administrador'), invalidates('estudiantes:*'), EstudianteController.eliminar);
