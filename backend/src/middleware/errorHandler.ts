import { Request, Response, NextFunction } from 'express';
import { AppError } from '../shared/errors';
import { config } from '../config';

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

  console.error('Error no controlado:', err);

  res.status(500).json({
    error: {
      message: config.nodeEnv === 'production'
        ? 'Error interno del servidor'
        : err.message,
    },
  });
};
