import { Router } from 'express';
import { DocenteController } from '../controllers/docente.controller';
import { validateCrearDocente } from '../validators/docente.validator';
import { authorize } from '../middlewares/rbac.middleware';

export const docenteRoutes = Router();

docenteRoutes.get('/', DocenteController.listar);
docenteRoutes.get('/:id', DocenteController.obtenerPorId);
docenteRoutes.post('/', authorize('Administrador', 'Control de Estudios', 'Coordinador'), validateCrearDocente, DocenteController.crear);
docenteRoutes.patch('/:id', authorize('Administrador', 'Control de Estudios', 'Coordinador'), DocenteController.actualizar);
docenteRoutes.delete('/:id', authorize('Administrador'), DocenteController.eliminar);
docenteRoutes.post('/:id/qr', authorize('Administrador'), DocenteController.generarQR);
