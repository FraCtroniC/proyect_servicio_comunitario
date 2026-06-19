import { describe, it, expect } from 'vitest';
import { AppError, NotFoundError, ValidationError } from '../shared/errors';

describe('AppError', () => {
  it('creates error with message and status code', () => {
    const err = new AppError('Algo salió mal', 400);
    expect(err.message).toBe('Algo salió mal');
    expect(err.statusCode).toBe(400);
    expect(err.isOperational).toBe(true);
  });

  it('defaults to 500 status code', () => {
    const err = new AppError('Error interno');
    expect(err.statusCode).toBe(500);
  });
});

describe('NotFoundError', () => {
  it('creates 404 error with custom message', () => {
    const err = new NotFoundError('Usuario no encontrado');
    expect(err.message).toBe('Usuario no encontrado');
    expect(err.statusCode).toBe(404);
  });

  it('uses default message', () => {
    const err = new NotFoundError();
    expect(err.message).toBe('Recurso no encontrado');
  });
});

describe('ValidationError', () => {
  it('creates 400 error with validation details', () => {
    const details = { username: ['El username es requerido'] };
    const err = new ValidationError(details);
    expect(err.message).toBe('Error de validación');
    expect(err.statusCode).toBe(400);
    expect(err.details).toEqual(details);
  });
});
