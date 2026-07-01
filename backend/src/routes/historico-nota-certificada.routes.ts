import { Router } from 'express';
import { HistoricoNotaCertificadaController } from '../controllers/historico-nota-certificada.controller';
import { authorize } from '../middlewares/rbac.middleware';

export const historicoNotaCertificadaRoutes = Router();

// Must be before /:id to avoid conflict with dynamic param
historicoNotaCertificadaRoutes.get('/estudiante/:estudianteId', HistoricoNotaCertificadaController.listarPorEstudiante);
historicoNotaCertificadaRoutes.post('/bulk', authorize('Administrador', 'Control de Estudios', 'Coordinador'), HistoricoNotaCertificadaController.crearBulk);

historicoNotaCertificadaRoutes.get('/', HistoricoNotaCertificadaController.listar);
historicoNotaCertificadaRoutes.get('/:id', HistoricoNotaCertificadaController.obtenerPorId);
historicoNotaCertificadaRoutes.get('/:id/generar-excel', HistoricoNotaCertificadaController.generarExcel);
historicoNotaCertificadaRoutes.post('/', authorize('Administrador', 'Control de Estudios', 'Coordinador'), HistoricoNotaCertificadaController.crear);
historicoNotaCertificadaRoutes.patch('/:id', authorize('Administrador', 'Control de Estudios', 'Coordinador'), HistoricoNotaCertificadaController.actualizar);
historicoNotaCertificadaRoutes.delete('/:id', authorize('Administrador'), HistoricoNotaCertificadaController.eliminar);
