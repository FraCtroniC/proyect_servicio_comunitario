import { describe, it, expect, vi } from 'vitest';

vi.mock('../models/Seccion', () => ({
  Seccion: { findAll: vi.fn(), findByPk: vi.fn(), create: vi.fn() },
}));

import { SeccionController } from '../controllers/seccion.controller';

describe('SeccionController', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  describe('listar', () => {
    it('retorna todas las secciones sin filtro', async () => {
      const { Seccion } = await import('../models/Seccion');
      const fakeData = [{ id_seccion: 1, grado: '1er' }];
      (Seccion.findAll as any).mockResolvedValue(fakeData);

      const req = { query: {} } as any;
      const res = { json: vi.fn() } as any;
      const next = vi.fn();

      await SeccionController.listar(req, res, next);
      expect(Seccion.findAll).toHaveBeenCalledWith({ where: {} });
      expect(res.json).toHaveBeenCalledWith({ data: fakeData });
    });

    it('filtra por id_periodo', async () => {
      const { Seccion } = await import('../models/Seccion');
      (Seccion.findAll as any).mockResolvedValue([]);

      const req = { query: { id_periodo: '3' } } as any;
      const res = { json: vi.fn() } as any;
      const next = vi.fn();

      await SeccionController.listar(req, res, next);
      expect(Seccion.findAll).toHaveBeenCalledWith({ where: { id_periodo: 3 } });
    });
  });

  describe('obtenerPorId', () => {
    it('retorna 404 si no existe', async () => {
      const { Seccion } = await import('../models/Seccion');
      (Seccion.findByPk as any).mockResolvedValue(null);

      const req = { params: { id: '999' } } as any;
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any;
      const next = vi.fn();

      await SeccionController.obtenerPorId(req, res, next);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('retorna seccion por ID', async () => {
      const { Seccion } = await import('../models/Seccion');
      const fake = { id_seccion: 1 };
      (Seccion.findByPk as any).mockResolvedValue(fake);

      const req = { params: { id: '1' } } as any;
      const res = { json: vi.fn() } as any;
      const next = vi.fn();

      await SeccionController.obtenerPorId(req, res, next);
      expect(res.json).toHaveBeenCalledWith({ data: fake });
    });
  });

  describe('crear', () => {
    it('crea una seccion', async () => {
      const { Seccion } = await import('../models/Seccion');
      const fake = { id_seccion: 1 };
      (Seccion.create as any).mockResolvedValue(fake);

      const req = { body: { grado: '1er' } } as any;
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any;
      const next = vi.fn();

      await SeccionController.crear(req, res, next);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ data: fake });
    });
  });

  describe('actualizar', () => {
    it('actualiza una seccion existente', async () => {
      const { Seccion } = await import('../models/Seccion');
      const updateMock = vi.fn().mockResolvedValue(undefined);
      const fake = { id_seccion: 1, update: updateMock };
      (Seccion.findByPk as any).mockResolvedValue(fake);

      const req = { params: { id: '1' }, body: { grado: '2do' } } as any;
      const res = { json: vi.fn() } as any;
      const next = vi.fn();

      await SeccionController.actualizar(req, res, next);
      expect(updateMock).toHaveBeenCalledWith({ grado: '2do' });
      expect(res.json).toHaveBeenCalledWith({ data: fake });
    });

    it('retorna 404 si no existe', async () => {
      const { Seccion } = await import('../models/Seccion');
      (Seccion.findByPk as any).mockResolvedValue(null);

      const req = { params: { id: '999' }, body: {} } as any;
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any;
      const next = vi.fn();

      await SeccionController.actualizar(req, res, next);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('eliminar', () => {
    it('elimina una seccion existente', async () => {
      const { Seccion } = await import('../models/Seccion');
      const destroyMock = vi.fn().mockResolvedValue(undefined);
      const fake = { id_seccion: 1, destroy: destroyMock };
      (Seccion.findByPk as any).mockResolvedValue(fake);

      const req = { params: { id: '1' } } as any;
      const res = { status: vi.fn((c: number) => res), send: vi.fn() } as any;
      const next = vi.fn();

      await SeccionController.eliminar(req, res, next);
      expect(destroyMock).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(204);
    });

    it('retorna 404 si no existe', async () => {
      const { Seccion } = await import('../models/Seccion');
      (Seccion.findByPk as any).mockResolvedValue(null);

      const req = { params: { id: '999' } } as any;
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any;
      const next = vi.fn();

      await SeccionController.eliminar(req, res, next);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});
