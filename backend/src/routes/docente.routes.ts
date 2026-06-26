import { Router } from 'express';
import { DocenteController } from '../controllers/docente.controller';
import { validateCrearDocente } from '../validators/docente.validator';
import { authorize } from '../middlewares/rbac.middleware';

export const docenteRoutes = Router();

docenteRoutes.get('/', DocenteController.listar);
docenteRoutes.get('/:id', DocenteController.obtenerPorId);
docenteRoutes.post('/', authorize(1, 3), validateCrearDocente, DocenteController.crear);
docenteRoutes.patch('/:id', authorize(1, 3), DocenteController.actualizar);
docenteRoutes.delete('/:id', authorize(1), DocenteController.eliminar);
docenteRoutes.post('/:id/qr', authorize(1), DocenteController.generarQR);
