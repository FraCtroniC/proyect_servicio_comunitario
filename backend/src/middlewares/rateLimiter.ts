import rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    error: {
      message: 'Demasiados intentos. Intenta de nuevo en 15 minutos.',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: {
    error: {
      message: 'Límite de solicitudes alcanzado. Intenta de nuevo más tarde.',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});
