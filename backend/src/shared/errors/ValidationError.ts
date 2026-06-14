import { AppError } from './AppError';

export class ValidationError extends AppError {
  public readonly details: Record<string, string[]>;

  constructor(details: Record<string, string[]>) {
    super('Error de validación', 400);
    this.details = details;
  }
}
