import { Router } from 'express';
import { EstudianteStreamController } from '../controllers/estudiante-stream.controller';

export const estudianteStreamRoutes = Router();

estudianteStreamRoutes.get('/stream', EstudianteStreamController.connect);
