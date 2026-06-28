import { Router } from 'express';
import { HistoricoNotaCertificadaController } from '../controllers/historico-nota-certificada.controller';
import { authorize } from '../middlewares/rbac.middleware';

export const historicoNotaCertificadaRoutes = Router();

historicoNotaCertificadaRoutes.get('/', HistoricoNotaCertificadaController.listar);
historicoNotaCertificadaRoutes.get('/:id', HistoricoNotaCertificadaController.obtenerPorId);
historicoNotaCertificadaRoutes.get('/:id/generar-excel', HistoricoNotaCertificadaController.generarExcel);
historicoNotaCertificadaRoutes.post('/', authorize(1, 3), HistoricoNotaCertificadaController.crear);
historicoNotaCertificadaRoutes.patch('/:id', authorize(1, 3), HistoricoNotaCertificadaController.actualizar);
historicoNotaCertificadaRoutes.delete('/:id', authorize(1), HistoricoNotaCertificadaController.eliminar);
