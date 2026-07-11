import { Request, Response, NextFunction } from 'express';
import { cacheService } from '../services/cache.service';

export interface CacheOptions {
  ttl: number;
  key?: string;
}

function keyFrom(req: Request): string {
  return req.originalUrl || req.url;
}

export function cacheable(options: CacheOptions) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const cacheKey = options.key || keyFrom(req);

    try {
      const cached = await cacheService.get<unknown>(cacheKey);
      if (cached !== null) {
        res.json(cached);
        return;
      }
    } catch {
      // Fall through
    }

    const originalJson = res.json.bind(res);

    res.json = (body: unknown) => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        cacheService.set(cacheKey, body, options.ttl);
      }
      return originalJson(body);
    };

    next();
  };
}

export function invalidates(...patterns: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const originalJson = res.json.bind(res);
    const originalSend = res.send.bind(res);
    const originalEnd = res.end.bind(res);

    const doInvalidate = () => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        for (const pattern of patterns) {
          cacheService.delByPattern(pattern);
        }
      }
    };

    res.json = (body: unknown) => {
      doInvalidate();
      return originalJson(body);
    };

    res.send = (body?: unknown) => {
      doInvalidate();
      return originalSend(body);
    };

    res.end = (cb?: unknown) => {
      doInvalidate();
      return originalEnd(cb);
    };

    next();
  };
}
