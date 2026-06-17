import { Router } from 'express';
import { AuditoriaController } from '../controllers/auditoria.controller';

export const auditoriaRoutes = Router();

auditoriaRoutes.get('/', AuditoriaController.listar);
auditoriaRoutes.get('/:id', AuditoriaController.obtenerPorId);
auditoriaRoutes.post('/', AuditoriaController.crear);
auditoriaRoutes.patch('/:id', AuditoriaController.actualizar);
auditoriaRoutes.delete('/:id', AuditoriaController.eliminar);
