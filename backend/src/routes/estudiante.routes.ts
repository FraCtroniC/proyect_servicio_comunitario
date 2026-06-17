import { Router } from 'express';
import { EstudianteController } from '../controllers/estudiante.controller';

export const estudianteRoutes = Router();

estudianteRoutes.get('/', EstudianteController.listar);
estudianteRoutes.get('/:id', EstudianteController.obtenerPorId);
estudianteRoutes.post('/', EstudianteController.crear);
estudianteRoutes.patch('/:id', EstudianteController.actualizar);
estudianteRoutes.delete('/:id', EstudianteController.eliminar);
