import { Router } from 'express';
import { RepresentanteStreamController } from '../controllers/representante-stream.controller';

export const representanteStreamRoutes = Router();

representanteStreamRoutes.get('/stream', RepresentanteStreamController.connect);
