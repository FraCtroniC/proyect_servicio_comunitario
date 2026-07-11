import Redis from 'ioredis';
import { environment } from './environment';

let redis: Redis | null = null;

export function getRedis(): Redis {
  if (!redis) {
    redis = new Redis(environment.redisUrl || 'redis://localhost:6379', {
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        if (times > 3) return null;
        return Math.min(times * 200, 2000);
      },
      lazyConnect: true,
    });

    redis.on('error', (err) => {
      console.error('Redis error:', err.message);
    });
  }
  return redis;
}

export async function connectRedis(): Promise<void> {
  const redis = getRedis();
  await redis.connect();
}

export async function closeRedis(): Promise<void> {
  if (redis) {
    await redis.quit();
    redis = null;
  }
}

export { Redis };
