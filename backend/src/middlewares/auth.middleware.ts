import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { environment } from '../../config/environment';
import { AppError } from '../shared/errors';

export interface AuthenticatedRequest extends Request {
  user?: {
    idUsuario: number;
    username: string;
    idRol: number;
    rol: string | null;
  };
}

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('No autorizado, token ausente o con formato incorrecto', 401));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, environment.jwtSecret) as any;
    req.user = {
      idUsuario: decoded.idUsuario,
      username: decoded.username,
      idRol: decoded.idRol,
      rol: decoded.rol,
    };
    next();
  } catch (error) {
    next(new AppError('No autorizado, token inválido o expirado', 401));
  }
}
