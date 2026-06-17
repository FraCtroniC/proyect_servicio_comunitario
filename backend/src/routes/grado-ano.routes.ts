import { Router } from 'express';
import { GradoAnoController } from '../controllers/grado-ano.controller';

export const gradoAnoRoutes = Router();

gradoAnoRoutes.get('/', GradoAnoController.listar);
gradoAnoRoutes.get('/:id', GradoAnoController.obtenerPorId);
gradoAnoRoutes.post('/', GradoAnoController.crear);
gradoAnoRoutes.patch('/:id', GradoAnoController.actualizar);
gradoAnoRoutes.delete('/:id', GradoAnoController.eliminar);
