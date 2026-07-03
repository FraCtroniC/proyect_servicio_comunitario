import rateLimit from 'express-rate-limit';
import { sequelize } from '../models';
import { QueryTypes } from 'sequelize';

const postgresStore = {
  async increment(key: string) {
    const [result] = await sequelize.query<{ count: string }>(
      `SELECT COUNT(*)::int as count FROM login_audit
       WHERE ip_address = $1
       AND created_at > NOW() - INTERVAL '15 minutes'`,
      { bind: [key], type: QueryTypes.SELECT }
    );
    return { totalHits: (Number(result?.count) || 0) + 1 };
  },
  async decrement() {},
  async resetKey() {},
};

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  keyGenerator: (req) => req.ip || req.socket.remoteAddress || 'unknown',
  store: postgresStore as any,
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
