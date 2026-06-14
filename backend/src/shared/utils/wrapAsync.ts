import { Request, Response, NextFunction } from 'express';
import { AsyncHandler } from '../types';

export const wrapAsync = (fn: AsyncHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
