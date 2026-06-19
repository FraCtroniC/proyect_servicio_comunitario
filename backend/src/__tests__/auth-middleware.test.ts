import { describe, it, expect, vi } from 'vitest';
import jwt from 'jsonwebtoken';
import { authMiddleware } from '../middlewares/auth.middleware';

vi.mock('../../config/environment', () => ({
  environment: {
    jwtSecret: 'test_secret',
  },
}));

describe('authMiddleware', () => {
  it('returns 401 if no authorization header', () => {
    const req = { headers: {} } as any;
    const res = {} as any;
    const next = vi.fn();

    authMiddleware(req, res, next);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining('No autorizado'), statusCode: 401 })
    );
  });

  it('returns 401 if token format is invalid', () => {
    const req = { headers: { authorization: 'InvalidFormat' } } as any;
    const res = {} as any;
    const next = vi.fn();

    authMiddleware(req, res, next);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 401 })
    );
  });

  it('calls next if token is valid', () => {
    const token = jwt.sign(
      { idUsuario: 1, username: 'test', idRol: 1, rol: 'Admin' },
      'test_secret'
    );

    const req = { headers: { authorization: `Bearer ${token}` } } as any;
    const res = {} as any;
    const next = vi.fn();

    authMiddleware(req, res, next);
    expect(next).toHaveBeenCalledWith();
    expect(req.user).toBeDefined();
    expect(req.user!.idUsuario).toBe(1);
  });
});
