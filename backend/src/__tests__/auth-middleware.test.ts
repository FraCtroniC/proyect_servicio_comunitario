import { describe, it, expect, vi } from 'vitest';
import jwt from 'jsonwebtoken';

const { mockFindByPk } = vi.hoisted(() => ({
  mockFindByPk: vi.fn(),
}));

vi.mock('../models', () => ({
  Usuario: {
    findByPk: mockFindByPk,
  },
}));

vi.mock('../../config/environment', () => ({
  environment: {
    jwtSecret: 'test_secret',
    jwtLegacySecrets: '',
  },
}));

import { authMiddleware } from '../middlewares/auth.middleware';

describe('authMiddleware', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('returns 401 if no authorization header', async () => {
    const req = { headers: {}, cookies: {} } as any;
    const res = {} as any;
    const next = vi.fn();

    await authMiddleware(req, res, next);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining('No autorizado'), statusCode: 401 })
    );
  });

  it('returns 401 if token format is invalid', async () => {
    const req = { headers: { authorization: 'InvalidFormat' }, cookies: {} } as any;
    const res = {} as any;
    const next = vi.fn();

    await authMiddleware(req, res, next);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 401 })
    );
  });

  it('calls next if token is valid and token_version matches', async () => {
    const token = jwt.sign(
      { idUsuario: 1, username: 'test', idRol: 1, rol: 'Admin', tokenVersion: 0 },
      'test_secret'
    );

    mockFindByPk.mockResolvedValue({
      getDataValue: () => 0,
    });

    const req = { headers: { authorization: `Bearer ${token}` }, cookies: {} } as any;
    const res = {} as any;
    const next = vi.fn();

    await authMiddleware(req, res, next);
    expect(next).toHaveBeenCalledWith();
    expect(req.user).toBeDefined();
    expect(req.user!.idUsuario).toBe(1);
  });

  it('returns 401 if token_version differs', async () => {
    const token = jwt.sign(
      { idUsuario: 1, username: 'test', idRol: 1, rol: 'Admin', tokenVersion: 0 },
      'test_secret'
    );

    mockFindByPk.mockResolvedValue({
      getDataValue: () => 1,
    });

    const req = { headers: { authorization: `Bearer ${token}` }, cookies: {} } as any;
    const res = {} as any;
    const next = vi.fn();

    await authMiddleware(req, res, next);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 401 })
    );
  });
});
