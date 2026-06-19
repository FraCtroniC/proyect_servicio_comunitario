import { Response, NextFunction } from 'express';
import { AppError } from '../shared/errors';
import { AuthenticatedRequest } from './auth.middleware';

type RolPermitido = number | number[];

export function authorize(...rolesPermitidos: RolPermitido[]) {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('No autorizado', 401));
    }

    const roles = rolesPermitidos.flat();
    if (!roles.includes(req.user.idRol)) {
      return next(new AppError('No tienes permisos para realizar esta acción', 403));
    }

    next();
  };
}
