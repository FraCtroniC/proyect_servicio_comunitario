import { Router } from 'express';
import { AsistenciaEstudianteStreamController } from '../controllers/asistencia-estudiante-stream.controller';

export const asistenciaEstudianteStreamRoutes = Router();

asistenciaEstudianteStreamRoutes.get('/stream', AsistenciaEstudianteStreamController.connect);
