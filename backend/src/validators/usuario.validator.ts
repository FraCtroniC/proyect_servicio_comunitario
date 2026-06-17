import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../shared/errors';

export const validateCrearUsuario = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  const errors: Record<string, string[]> = {};

  if (!req.body.username) errors.username = ['El username es requerido'];
  if (!req.body.password) errors.password = ['La contraseña es requerida'];
  if (!req.body.idRol && req.body.idRol !== 0) errors.idRol = ['El idRol es requerido'];

  if (Object.keys(errors).length > 0) {
    throw new ValidationError(errors);
  }

  next();
};
