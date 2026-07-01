import { Router } from 'express';
import { GradoAnoController } from '../controllers/grado-ano.controller';
import { validateCrearGradoAno } from '../validators/grado-ano.validator';
import { authorize } from '../middlewares/rbac.middleware';

export const gradoAnoRoutes = Router();

gradoAnoRoutes.get('/', GradoAnoController.listar);
gradoAnoRoutes.get('/:id', GradoAnoController.obtenerPorId);
gradoAnoRoutes.post('/', authorize('Administrador', 'Control de Estudios', 'Coordinador'), validateCrearGradoAno, GradoAnoController.crear);
gradoAnoRoutes.patch('/:id', authorize('Administrador', 'Control de Estudios', 'Coordinador'), GradoAnoController.actualizar);
gradoAnoRoutes.delete('/:id', authorize('Administrador'), GradoAnoController.eliminar);
