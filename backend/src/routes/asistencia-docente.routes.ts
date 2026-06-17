import { Router } from 'express';
import { AsistenciaDocenteController } from '../controllers/asistencia-docente.controller';

export const asistenciaDocenteRoutes = Router();

asistenciaDocenteRoutes.get('/', AsistenciaDocenteController.listar);
asistenciaDocenteRoutes.get('/:id', AsistenciaDocenteController.obtenerPorId);
asistenciaDocenteRoutes.post('/', AsistenciaDocenteController.crear);
asistenciaDocenteRoutes.patch('/:id', AsistenciaDocenteController.actualizar);
asistenciaDocenteRoutes.delete('/:id', AsistenciaDocenteController.eliminar);
