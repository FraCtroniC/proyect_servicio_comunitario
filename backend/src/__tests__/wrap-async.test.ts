import { describe, it, expect, vi } from 'vitest';
import { wrapAsync } from '../shared/utils/wrapAsync';

describe('wrapAsync', () => {
  it('calls next with error when handler rejects', async () => {
    const error = new Error('Async error');
    const handler = wrapAsync(async () => { throw error; });

    const req = {} as any;
    const res = {} as any;
    const next = vi.fn();

    await handler(req, res, next);
    expect(next).toHaveBeenCalledWith(error);
  });

  it('calls handler successfully when no error', async () => {
    const handler = wrapAsync(async (_req: any, res: any) => {
      res.json({ ok: true });
    });

    const req = {} as any;
    const res = { json: vi.fn() } as any;
    const next = vi.fn();

    await handler(req, res, next);
    expect(res.json).toHaveBeenCalledWith({ ok: true });
    expect(next).not.toHaveBeenCalled();
  });
});
