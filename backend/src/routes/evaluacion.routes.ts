import { Router } from 'express';
import { EvaluacionController } from '../controllers/evaluacion.controller';
import { authorize } from '../middlewares/rbac.middleware';
import { auditLog } from '../middlewares/audit.middleware';

export const evaluacionRoutes = Router();

// Rutas para Planes de Evaluación
evaluacionRoutes.get('/planes', authorize('Administrador', 'Control de Estudios', 'Coordinador'), EvaluacionController.listarPlanes);
evaluacionRoutes.post('/planes', authorize('Administrador', 'Control de Estudios', 'Coordinador'), auditLog('Configuración', 'evaluaciones'), EvaluacionController.upsertPlan);

// Rutas para Notas Parciales
evaluacionRoutes.get('/notas', authorize('Administrador', 'Control de Estudios', 'Coordinador'), EvaluacionController.listarNotas);
evaluacionRoutes.post('/notas/bulk', authorize('Administrador', 'Control de Estudios', 'Coordinador'), auditLog('Registro', 'notas_parciales'), EvaluacionController.upsertNotas);
