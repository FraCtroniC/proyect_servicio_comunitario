import { Router } from 'express';
import { HorarioStreamController } from '../controllers/horario-stream.controller';

export const horarioStreamRoutes = Router();

horarioStreamRoutes.get('/stream', HorarioStreamController.connect);
