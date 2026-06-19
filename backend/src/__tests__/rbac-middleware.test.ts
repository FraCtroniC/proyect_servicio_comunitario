import { describe, it, expect, vi } from 'vitest';
import { authorize } from '../middlewares/rbac.middleware';

describe('authorize middleware', () => {
  it('returns 401 if user is not in request', () => {
    const middleware = authorize(1);
    const req = {} as any;
    const res = {} as any;
    const next = vi.fn();

    middleware(req, res, next);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 401 })
    );
  });

  it('returns 403 if user role is not allowed', () => {
    const middleware = authorize(1);
    const req = { user: { idRol: 2 } } as any;
    const res = {} as any;
    const next = vi.fn();

    middleware(req, res, next);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 403 })
    );
  });

  it('calls next if user role is allowed', () => {
    const middleware = authorize(1, 3);
    const req = { user: { idRol: 1 } } as any;
    const res = {} as any;
    const next = vi.fn();

    middleware(req, res, next);
    expect(next).toHaveBeenCalledWith();
  });

  it('accepts multiple roles', () => {
    const middleware = authorize([1, 2, 3]);
    const req = { user: { idRol: 2 } } as any;
    const res = {} as any;
    const next = vi.fn();

    middleware(req, res, next);
    expect(next).toHaveBeenCalledWith();
  });
});
