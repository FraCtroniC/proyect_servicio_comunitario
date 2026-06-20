import { Router } from 'express';
import { EvaluacionController } from '../controllers/evaluacion.controller';
import { authorize } from '../middlewares/rbac.middleware';
import { auditLog } from '../middlewares/audit.middleware';

export const evaluacionRoutes = Router();

// Rutas para Planes de Evaluación
evaluacionRoutes.get('/planes', authorize(1, 2, 3), EvaluacionController.listarPlanes);
evaluacionRoutes.post('/planes', authorize(1, 2, 3), auditLog('Configuración', 'evaluaciones'), EvaluacionController.upsertPlan);

// Rutas para Notas Parciales
evaluacionRoutes.get('/notas', authorize(1, 2, 3), EvaluacionController.listarNotas);
evaluacionRoutes.post('/notas/bulk', authorize(1, 2, 3), auditLog('Registro', 'notas_parciales'), EvaluacionController.upsertNotas);
