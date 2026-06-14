import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../../../shared/errors';

export const validateCrearUsuario = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  const errors: Record<string, string[]> = {};

  if (!req.body.nombre) errors.nombre = ['El nombre es requerido'];
  if (!req.body.email) errors.email = ['El email es requerido'];
  if (!req.body.password) errors.password = ['La contraseña es requerida'];

  if (Object.keys(errors).length > 0) {
    throw new ValidationError(errors);
  }

  next();
};
