import { Router } from 'express';
import { MatriculaController } from '../controllers/matricula.controller';
import { validateCrearMatricula } from '../validators/matricula.validator';
import { authorize } from '../middlewares/rbac.middleware';
import { cacheable, invalidates } from '../middlewares/cache.middleware';

export const matriculaRoutes = Router();

matriculaRoutes.get('/', cacheable({ ttl: 600 }), MatriculaController.listar);
matriculaRoutes.get('/:id', cacheable({ ttl: 600 }), MatriculaController.obtenerPorId);
matriculaRoutes.post('/', authorize('Administrador', 'Control de Estudios', 'Coordinador'), validateCrearMatricula, invalidates('matriculas:*'), MatriculaController.crear);
matriculaRoutes.patch('/:id', authorize('Administrador', 'Control de Estudios', 'Coordinador'), invalidates('matriculas:*'), MatriculaController.actualizar);
matriculaRoutes.delete('/:id', authorize('Administrador'), invalidates('matriculas:*'), MatriculaController.eliminar);
