import { Router } from 'express';
import { EvaluacionController } from '../controllers/evaluacion.controller';
import { authorize } from '../middlewares/rbac.middleware';
import { auditLog } from '../middlewares/audit.middleware';

export const evaluacionRoutes = Router();

evaluacionRoutes.get('/planes', authorize('Administrador', 'Control de Estudios', 'Docente'), EvaluacionController.listarPlanes);
evaluacionRoutes.post('/planes', authorize('Administrador', 'Control de Estudios', 'Docente'), auditLog('Configuración', 'evaluaciones'), EvaluacionController.upsertPlan);

evaluacionRoutes.get('/notas', authorize('Administrador', 'Control de Estudios', 'Docente'), EvaluacionController.listarNotas);
evaluacionRoutes.post('/notas/bulk', authorize('Administrador', 'Control de Estudios', 'Docente'), auditLog('Registro', 'notas_parciales'), EvaluacionController.upsertNotas);
