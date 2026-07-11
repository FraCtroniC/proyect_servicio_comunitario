import { Router } from 'express';
import { GradoAnoController } from '../controllers/grado-ano.controller';
import { validateCrearGradoAno } from '../validators/grado-ano.validator';
import { authorize } from '../middlewares/rbac.middleware';
import { cacheable, invalidates } from '../middlewares/cache.middleware';

export const gradoAnoRoutes = Router();

gradoAnoRoutes.get('/', cacheable({ ttl: 3600 }), GradoAnoController.listar);
gradoAnoRoutes.get('/:id', cacheable({ ttl: 3600 }), GradoAnoController.obtenerPorId);
gradoAnoRoutes.post('/', authorize('Administrador', 'Control de Estudios', 'Coordinador'), validateCrearGradoAno, invalidates('grados:*'), GradoAnoController.crear);
gradoAnoRoutes.patch('/:id', authorize('Administrador', 'Control de Estudios', 'Coordinador'), invalidates('grados:*'), GradoAnoController.actualizar);
gradoAnoRoutes.delete('/:id', authorize('Administrador'), invalidates('grados:*'), GradoAnoController.eliminar);
