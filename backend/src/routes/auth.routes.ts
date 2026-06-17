import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';

export const authRoutes = Router();

authRoutes.post('/login', AuthController.login);
authRoutes.post('/forgot-password', AuthController.solicitarRecuperacion);
authRoutes.post('/reset-password', AuthController.restablecerPassword);
