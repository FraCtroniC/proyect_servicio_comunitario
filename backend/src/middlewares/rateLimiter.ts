import rateLimit, { ipKeyGenerator } from 'express-rate-limit';

const WINDOW_MS = 15 * 60 * 1000;

export const authLimiter = rateLimit({
  windowMs: WINDOW_MS,
  max: 100,
  keyGenerator: (req) => ipKeyGenerator(req.ip || req.socket.remoteAddress || 'unknown'),
    message: {
    error: {
      message: 'Demasiados intentos. Intenta de nuevo en 15 minutos.',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});
