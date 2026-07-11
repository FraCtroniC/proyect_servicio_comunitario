import { Router } from 'express';
import { EvaluacionController } from '../controllers/evaluacion.controller';
import { authorize } from '../middlewares/rbac.middleware';
import { auditLog } from '../middlewares/audit.middleware';
import { cacheable, invalidates } from '../middlewares/cache.middleware';

export const evaluacionRoutes = Router();

evaluacionRoutes.get('/planes', cacheable({ ttl: 600 }), authorize('Administrador', 'Control de Estudios', 'Coordinador'), EvaluacionController.listarPlanes);
evaluacionRoutes.post('/planes', authorize('Administrador', 'Control de Estudios', 'Coordinador'), auditLog('Configuración', 'evaluaciones'), invalidates('evaluaciones:*'), EvaluacionController.upsertPlan);

evaluacionRoutes.get('/notas', cacheable({ ttl: 300 }), authorize('Administrador', 'Control de Estudios', 'Coordinador'), EvaluacionController.listarNotas);
evaluacionRoutes.post('/notas/bulk', authorize('Administrador', 'Control de Estudios', 'Coordinador'), auditLog('Registro', 'notas_parciales'), invalidates('evaluaciones:*'), EvaluacionController.upsertNotas);
