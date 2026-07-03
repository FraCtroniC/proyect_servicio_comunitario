import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authLimiter } from '../middlewares/rateLimiter';
import { authMiddleware } from '../middlewares/auth.middleware';

export const authRoutes = Router();

authRoutes.get('/csrf-token', AuthController.obtenerCsrfToken);
authRoutes.post('/login', authLimiter, AuthController.login);
authRoutes.post('/forgot-password', authLimiter, AuthController.solicitarRecuperacion);
authRoutes.post('/reset-password', authLimiter, AuthController.restablecerPassword);
authRoutes.post('/refresh', AuthController.refresh);
authRoutes.post('/logout', AuthController.logout);
authRoutes.get('/profile', authMiddleware, AuthController.obtenerPerfil);
authRoutes.patch('/change-password', authMiddleware, AuthController.cambiarPassword);
