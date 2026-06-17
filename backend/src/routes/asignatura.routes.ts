import { Router } from 'express';
import { AsignaturaController } from '../controllers/asignatura.controller';

export const asignaturaRoutes = Router();

asignaturaRoutes.get('/', AsignaturaController.listar);
asignaturaRoutes.get('/:id', AsignaturaController.obtenerPorId);
asignaturaRoutes.post('/', AsignaturaController.crear);
asignaturaRoutes.patch('/:id', AsignaturaController.actualizar);
asignaturaRoutes.delete('/:id', AsignaturaController.eliminar);
