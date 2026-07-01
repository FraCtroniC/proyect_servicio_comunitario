import { Response, NextFunction } from 'express';
import { AppError } from '../shared/errors';
import { AuthenticatedRequest } from './auth.middleware';

type RolPermitido = number | string;

export function authorize(...rolesPermitidos: RolPermitido[]) {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('No autorizado', 401));
    }

    const hasAccess = rolesPermitidos.some(rol => 
      rol === req.user?.idRol || rol === req.user?.rol
    );

    if (!hasAccess) {
      return next(new AppError('No tienes permisos para realizar esta acción', 403));
    }

    next();
  };
}
