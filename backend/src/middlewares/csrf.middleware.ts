import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { environment } from '../../config/environment';
import { AppError } from '../shared/errors';

const CSRF_COOKIE = 'csrf_token';
const CSRF_HEADER = 'x-csrf-token';
const SAFE_METHODS = ['GET', 'HEAD', 'OPTIONS'];

export function csrfProtection(req: Request, res: Response, next: NextFunction) {
  if (SAFE_METHODS.includes(req.method)) {
    if (!req.cookies?.[CSRF_COOKIE]) {
      const token = crypto.randomUUID();
      res.cookie(CSRF_COOKIE, token, {
        httpOnly: false,
        secure: environment.nodeEnv === 'production',
        sameSite: environment.nodeEnv === 'production' ? 'none' : 'lax',
        maxAge: 24 * 60 * 60 * 1000,
      });
    }
    return next();
  }

  const cookieToken = req.cookies?.[CSRF_COOKIE];
  const headerToken = req.headers[CSRF_HEADER];

  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    return next(new AppError('CSRF token inválido', 403));
  }

  next();
}
