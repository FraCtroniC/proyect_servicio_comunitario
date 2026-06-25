import { describe, it, expect, vi } from 'vitest';

const { Matricula, Estudiante } = vi.hoisted(() => ({
  Matricula: { findAll: vi.fn(), findByPk: vi.fn(), create: vi.fn() },
  Estudiante: { findAll: vi.fn(), findByPk: vi.fn(), create: vi.fn() },
}));

vi.mock('../models', () => ({ Matricula, Estudiante }));

import { MatriculaController } from '../controllers/matricula.controller';

describe('MatriculaController', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('listar retorna todas', async () => {
    Matricula.findAll.mockResolvedValue([{ id: 1 }]);
    const res = { json: vi.fn() } as any;
    await MatriculaController.listar({ query: {} } as any, res, vi.fn());
    expect(res.json).toHaveBeenCalledWith({ data: [{ id: 1 }] });
  });

  it('obtenerPorId retorna 404 si no existe', async () => {
    Matricula.findByPk.mockResolvedValue(null);
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any;
    await MatriculaController.obtenerPorId({ params: { id: '999' } } as any, res, vi.fn());
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('actualizar retorna 404 si no existe', async () => {
    Matricula.findByPk.mockResolvedValue(null);
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any;
    await MatriculaController.actualizar({ params: { id: '999' }, body: {} } as any, res, vi.fn());
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('eliminar retorna 204 si existe', async () => {
    let destroyed = false;
    Matricula.findByPk.mockResolvedValue({ id: 1, destroy: vi.fn(() => { destroyed = true; }) });
    const res = { status: vi.fn((c: number) => res), send: vi.fn() } as any;
    await MatriculaController.eliminar({ params: { id: '1' } } as any, res, vi.fn());
    expect(res.status).toHaveBeenCalledWith(204);
    expect(destroyed).toBe(true);
  });
});
