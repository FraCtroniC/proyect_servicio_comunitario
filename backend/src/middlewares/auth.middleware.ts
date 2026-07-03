import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Usuario } from '../models';
import { environment } from '../../config/environment';
import { AppError } from '../shared/errors';

export interface AuthenticatedRequest extends Request {
  user?: {
    idUsuario: number;
    username: string;
    idRol: number;
    rol: string | null;
    tokenVersion: number;
  };
}

const allSecrets = getSecretList();

function getSecretList(): string[] {
  const secrets = [environment.jwtSecret];
  if (environment.jwtLegacySecrets) {
    secrets.push(...environment.jwtLegacySecrets.split(',').map(s => s.trim()).filter(Boolean));
  }
  return secrets;
}

function verifyToken(token: string): any {
  let lastError: any = null;
  for (const secret of allSecrets) {
    try {
      return jwt.verify(token, secret, { algorithms: ['HS256'] });
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError || new Error('Token inválido');
}

export async function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const token = req.cookies?.access_token || extractBearerToken(req);

  if (!token) {
    return next(new AppError('No autorizado, token ausente o con formato incorrecto', 401));
  }

  try {
    const decoded = verifyToken(token) as any;

    const usuario = await Usuario.findByPk(decoded.idUsuario, {
      attributes: ['id_usuario', 'token_version'],
    });

    if (!usuario) {
      return next(new AppError('No autorizado, usuario no encontrado', 401));
    }

    const tokenVersion = usuario.getDataValue('token_version') as number;
    if (decoded.tokenVersion !== tokenVersion) {
      return next(new AppError('Sesión inválida, inicie sesión nuevamente', 401));
    }

    req.user = {
      idUsuario: decoded.idUsuario,
      username: decoded.username,
      idRol: decoded.idRol,
      rol: decoded.rol,
      tokenVersion,
    };
    next();
  } catch {
    next(new AppError('No autorizado, token inválido o expirado', 401));
  }
}

function extractBearerToken(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.split(' ')[1];
}
