import { Request, Response, NextFunction } from 'express';
import { AppError } from '../shared/errors';
import { environment } from '../../config/environment';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: {
        message: err.message,
        ...(err.statusCode === 400 && 'details' in err
          ? { details: (err as any).details }
          : {}),
      },
    });
    return;
  }

  if (err.name === 'SequelizeForeignKeyConstraintError') {
    res.status(400).json({
      error: {
        message: 'No se puede completar la acción porque el registro tiene otros datos asociados en el sistema.',
      },
    });
    return;
  }

  console.error('Error no controlado:', err);

  res.status(500).json({
    error: {
      message: environment.nodeEnv === 'production'
        ? 'Error interno del servidor'
        : err.message,
    },
  });
};
