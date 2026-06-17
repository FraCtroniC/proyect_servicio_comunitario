import { Router } from 'express';
import { MatriculaController } from '../controllers/matricula.controller';

export const matriculaRoutes = Router();

matriculaRoutes.get('/', MatriculaController.listar);
matriculaRoutes.get('/:id', MatriculaController.obtenerPorId);
matriculaRoutes.post('/', MatriculaController.crear);
matriculaRoutes.patch('/:id', MatriculaController.actualizar);
matriculaRoutes.delete('/:id', MatriculaController.eliminar);
