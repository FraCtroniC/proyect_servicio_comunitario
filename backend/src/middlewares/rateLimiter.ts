import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
import { getRedis } from '../../config/redis';

const WINDOW_MS = 15 * 60 * 1000;

function makeRedisStore(prefix: string) {
  return {
    async increment(key: string) {
      try {
        const redisKey = `${prefix}:${key}`;
        const redis = getRedis();
        const current = await redis.incr(redisKey);
        if (current === 1) {
          await redis.pexpire(redisKey, WINDOW_MS);
        }
        return { totalHits: current };
      } catch {
        return { totalHits: 1 };
      }
    },
    async decrement(key: string) {
      try {
        const redis = getRedis();
        await redis.decr(`${prefix}:${key}`);
      } catch {
        // Silently fail
      }
    },
    async resetKey(key: string) {
      try {
        const redis = getRedis();
        await redis.del(`${prefix}:${key}`);
      } catch {
        // Silently fail
      }
    },
  };
}

export const authLimiter = rateLimit({
  windowMs: WINDOW_MS,
  max: 10,
  keyGenerator: (req) => ipKeyGenerator(req.ip || req.socket.remoteAddress || 'unknown'),
  store: makeRedisStore('rl:auth') as any,
  message: {
    error: {
      message: 'Demasiados intentos. Intenta de nuevo en 15 minutos.',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const apiLimiter = rateLimit({
  windowMs: WINDOW_MS,
  max: 200,
  skip: (req) => req.url.includes('/stream'),
  message: {
    error: {
      message: 'Límite de solicitudes alcanzado. Intenta de nuevo más tarde.',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});
