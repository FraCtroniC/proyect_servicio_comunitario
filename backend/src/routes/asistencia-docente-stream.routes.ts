import { Router } from 'express';
import { AsistenciaDocenteStreamController } from '../controllers/asistencia-docente-stream.controller';

export const asistenciaDocenteStreamRoutes = Router();

asistenciaDocenteStreamRoutes.get('/stream', AsistenciaDocenteStreamController.connect);
