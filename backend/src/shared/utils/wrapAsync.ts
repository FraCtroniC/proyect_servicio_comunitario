import { Request, Response, NextFunction } from 'express';
import fs from 'fs';

export const wrapAsync = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    return fn(req, res, next).catch(err => {
      fs.appendFileSync('backend_errors.log', new Date().toISOString() + '\n' + String(err.stack || err) + '\n\n');
      next(err);
    });
  };
};
