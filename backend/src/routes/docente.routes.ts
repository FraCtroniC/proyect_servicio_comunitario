import { Router } from 'express';
import { DocenteController } from '../controllers/docente.controller';
import { validateCrearDocente } from '../validators/docente.validator';
import { authorize } from '../middlewares/rbac.middleware';
import { cacheable, invalidates } from '../middlewares/cache.middleware';

export const docenteRoutes = Router();

docenteRoutes.get('/', cacheable({ ttl: 600 }), DocenteController.listar);
docenteRoutes.get('/:id', cacheable({ ttl: 600 }), DocenteController.obtenerPorId);
docenteRoutes.post('/', authorize('Administrador', 'Control de Estudios', 'Coordinador'), validateCrearDocente, invalidates('docentes:*'), DocenteController.crear);
docenteRoutes.patch('/:id', authorize('Administrador', 'Control de Estudios', 'Coordinador'), invalidates('docentes:*'), DocenteController.actualizar);
docenteRoutes.delete('/:id', authorize('Administrador'), invalidates('docentes:*'), DocenteController.eliminar);
docenteRoutes.post('/:id/qr', authorize('Administrador'), DocenteController.generarQR);
