import { Router } from 'express';
import { DocenteController } from '../controllers/docente.controller';

export const docenteRoutes = Router();

docenteRoutes.get('/', DocenteController.listar);
docenteRoutes.get('/:id', DocenteController.obtenerPorId);
docenteRoutes.post('/', DocenteController.crear);
docenteRoutes.patch('/:id', DocenteController.actualizar);
docenteRoutes.delete('/:id', DocenteController.eliminar);
