import { Router } from 'express';
import { HistoricoNotaCertificadaController } from '../controllers/historico-nota-certificada.controller';

export const historicoNotaCertificadaRoutes = Router();

historicoNotaCertificadaRoutes.get('/', HistoricoNotaCertificadaController.listar);
historicoNotaCertificadaRoutes.get('/:id', HistoricoNotaCertificadaController.obtenerPorId);
historicoNotaCertificadaRoutes.post('/', HistoricoNotaCertificadaController.crear);
historicoNotaCertificadaRoutes.patch('/:id', HistoricoNotaCertificadaController.actualizar);
historicoNotaCertificadaRoutes.delete('/:id', HistoricoNotaCertificadaController.eliminar);
