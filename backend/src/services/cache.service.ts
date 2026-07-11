import { getRedis } from '../../config/redis';

const KEY_SEPARATOR = ':';
const WILDCARD = '*';

function buildKey(entity: string, id?: string | number): string {
  return id !== undefined ? `${entity}${KEY_SEPARATOR}${id}` : entity;
}

function buildPattern(entity: string): string {
  return `${entity}${KEY_SEPARATOR}${WILDCARD}`;
}

export const cacheService = {
  async get<T>(key: string): Promise<T | null> {
    try {
      const redis = getRedis();
      const data = await redis.get(key);
      if (!data) return null;
      return JSON.parse(data) as T;
    } catch {
      return null;
    }
  },

  async set(key: string, value: unknown, ttlSeconds: number): Promise<void> {
    try {
      const redis = getRedis();
      await redis.setex(key, ttlSeconds, JSON.stringify(value));
    } catch {
      // Silently fail — cache should never break the app
    }
  },

  async del(key: string): Promise<void> {
    try {
      const redis = getRedis();
      await redis.del(key);
    } catch {
      // Silently fail
    }
  },

  async delByPattern(pattern: string): Promise<void> {
    try {
      const redis = getRedis();
      let cursor = '0';
      do {
        const [nextCursor, keys] = await redis.scan(cursor, 'MATCH', pattern, 'COUNT', '100');
        cursor = nextCursor;
        if (keys.length > 0) {
          await redis.del(...keys);
        }
      } while (cursor !== '0');
    } catch {
      // Silently fail
    }
  },

  async invalidateEntity(entity: string): Promise<void> {
    await this.del(entity);
    await this.delByPattern(buildPattern(entity));
  },

  buildKey,
  buildPattern,
};
