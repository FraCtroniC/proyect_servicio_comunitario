import { AppError } from './AppError';

export class NotFoundError extends AppError {
  constructor(message: string = 'Recurso no encontrado') {
    super(message, 404);
  }
}
