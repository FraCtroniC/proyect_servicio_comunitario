import { describe, it, expect, vi } from 'vitest';

vi.mock('../services/usuario.service', () => ({
  UsuarioService: {
    listar: vi.fn(),
    obtenerPorId: vi.fn(),
    crear: vi.fn(),
    actualizar: vi.fn(),
    eliminar: vi.fn(),
  },
}));

import { UsuarioController } from '../controllers/usuario.controller';

describe('UsuarioController', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  describe('listar', () => {
    it('retorna lista de usuarios', async () => {
      const { UsuarioService } = await import('../services/usuario.service');
      const fake = [{ id: 1, username: 'admin' }];
      UsuarioService.listar.mockResolvedValue(fake);

      const req = {} as any;
      const res = { json: vi.fn() } as any;
      const next = vi.fn();
      await UsuarioController.listar(req, res, next);
      expect(res.json).toHaveBeenCalledWith({ data: fake });
    });
  });

  describe('obtenerPorId', () => {
    it('retorna usuario por ID', async () => {
      const { UsuarioService } = await import('../services/usuario.service');
      UsuarioService.obtenerPorId.mockResolvedValue({ id: 1 });

      const req = { params: { id: '1' } } as any;
      const res = { json: vi.fn() } as any;
      const next = vi.fn();
      await UsuarioController.obtenerPorId(req, res, next);
      expect(UsuarioService.obtenerPorId).toHaveBeenCalledWith(1);
      expect(res.json).toHaveBeenCalled();
    });
  });

  describe('crear', () => {
    it('crea usuario via servicio', async () => {
      const { UsuarioService } = await import('../services/usuario.service');
      const fake = { id: 1, username: 'nuevo' };
      UsuarioService.crear.mockResolvedValue(fake);

      const req = { body: { username: 'nuevo', password: 'pass', idRol: 1 } } as any;
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any;
      const next = vi.fn();
      await UsuarioController.crear(req, res, next);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ data: fake });
    });
  });

  describe('actualizar', () => {
    it('actualiza usuario via servicio', async () => {
      const { UsuarioService } = await import('../services/usuario.service');
      UsuarioService.actualizar.mockResolvedValue({ id: 1 });

      const req = { params: { id: '1' }, body: { username: 'editado' } } as any;
      const res = { json: vi.fn() } as any;
      const next = vi.fn();
      await UsuarioController.actualizar(req, res, next);
      expect(res.json).toHaveBeenCalled();
    });
  });

  describe('eliminar', () => {
    it('elimina usuario via servicio', async () => {
      const { UsuarioService } = await import('../services/usuario.service');
      UsuarioService.eliminar.mockResolvedValue(undefined);

      const req = { params: { id: '1' } } as any;
      const res = { status: vi.fn((c: number) => res), send: vi.fn() } as any;
      const next = vi.fn();
      await UsuarioController.eliminar(req, res, next);
      expect(res.status).toHaveBeenCalledWith(204);
    });
  });
});
