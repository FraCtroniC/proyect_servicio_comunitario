import { Router } from 'express';
import { GradoAnoController } from '../controllers/grado-ano.controller';
import { validateCrearGradoAno } from '../validators/grado-ano.validator';
import { authorize } from '../middlewares/rbac.middleware';

export const gradoAnoRoutes = Router();

gradoAnoRoutes.get('/', GradoAnoController.listar);
gradoAnoRoutes.get('/:id', GradoAnoController.obtenerPorId);
gradoAnoRoutes.post('/', authorize(1, 3), validateCrearGradoAno, GradoAnoController.crear);
gradoAnoRoutes.patch('/:id', authorize(1, 3), GradoAnoController.actualizar);
gradoAnoRoutes.delete('/:id', authorize(1), GradoAnoController.eliminar);
