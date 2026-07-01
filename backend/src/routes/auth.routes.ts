import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authLimiter } from '../middlewares/rateLimiter';
import { authMiddleware } from '../middlewares/auth.middleware';

export const authRoutes = Router();

// Rutas públicas
authRoutes.post('/login', authLimiter, AuthController.login);
authRoutes.post('/forgot-password', authLimiter, AuthController.solicitarRecuperacion);
authRoutes.post('/reset-password', authLimiter, AuthController.restablecerPassword);

// Rutas protegidas (requieren JWT)
authRoutes.get('/profile', authMiddleware, AuthController.obtenerPerfil);
authRoutes.patch('/change-password', authMiddleware, AuthController.cambiarPassword);
