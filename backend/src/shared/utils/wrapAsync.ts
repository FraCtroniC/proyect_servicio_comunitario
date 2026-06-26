import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';

const LOG_FILE = path.join(__dirname, '../../../backend_errors.log');

function logErrorAsync(err: any) {
  const message = new Date().toISOString() + '\n' + String(err.stack || err) + '\n\n';
  fs.promises.appendFile(LOG_FILE, message).catch(() => {});
}

export const wrapAsync = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    return fn(req, res, next).catch(err => {
      logErrorAsync(err);
      next(err);
    });
  };
};
