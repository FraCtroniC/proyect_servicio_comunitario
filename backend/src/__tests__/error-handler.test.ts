import { describe, it, expect, vi } from 'vitest';
import { errorHandler } from '../middlewares/errorHandler';
import { AppError, ValidationError } from '../shared/errors';

describe('errorHandler', () => {
  it('returns structured error for AppError', () => {
    const err = new AppError('Algo salió mal', 400);
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any;

    errorHandler(err, {} as any, res, {} as any);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: { message: 'Algo salió mal' },
    });
  });

  it('includes details for ValidationError', () => {
    const err = new ValidationError({ username: ['Requerido'] });
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any;

    errorHandler(err, {} as any, res, {} as any);

    expect(res.json).toHaveBeenCalledWith({
      error: { message: 'Error de validación', details: { username: ['Requerido'] } },
    });
  });
});
