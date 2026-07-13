import { Router } from 'express';
import { JustificacionStreamController } from '../controllers/justificacion-stream.controller';

export const justificacionStreamRoutes = Router();

justificacionStreamRoutes.get('/stream', JustificacionStreamController.connect);
