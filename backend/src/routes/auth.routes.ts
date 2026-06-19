import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authLimiter } from '../middlewares/rateLimiter';

export const authRoutes = Router();

authRoutes.post('/login', authLimiter, AuthController.login);
authRoutes.post('/forgot-password', authLimiter, AuthController.solicitarRecuperacion);
authRoutes.post('/reset-password', authLimiter, AuthController.restablecerPassword);
