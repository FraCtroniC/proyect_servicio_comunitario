import { describe, it, expect, vi } from 'vitest';

vi.mock('../models/Docente', () => ({
  Docente: {
    findAll: vi.fn(),
    findByPk: vi.fn(),
    create: vi.fn(),
  },
}));

vi.mock('uuid', () => ({
  v4: vi.fn(() => 'mock-uuid-123'),
}));

import { DocenteController } from '../controllers/docente.controller';

describe('DocenteController', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('listar', () => {
    it('retorna todos los docentes', async () => {
      const { Docente } = await import('../models/Docente');
      const fakeData = [{ id_docente: 1, nombre1: 'María' }];
      (Docente.findAll as any).mockResolvedValue(fakeData);

      const req = {} as any;
      const res = { json: vi.fn() } as any;
      const next = vi.fn();

      await DocenteController.listar(req, res, next);
      expect(Docente.findAll).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ data: fakeData });
    });

    it('maneja errores del modelo', async () => {
      const { Docente } = await import('../models/Docente');
      const error = new Error('DB error');
      (Docente.findAll as any).mockImplementation(() => Promise.reject(error));

      const req = {} as any;
      const res = { json: vi.fn() } as any;
      const next = vi.fn();

      await DocenteController.listar(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('obtenerPorId', () => {
    it('retorna docente por ID', async () => {
      const { Docente } = await import('../models/Docente');
      const fakeRecord = { id_docente: 1, nombre1: 'María' };
      (Docente.findByPk as any).mockResolvedValue(fakeRecord);

      const req = { params: { id: '1' } } as any;
      const res = { json: vi.fn() } as any;
      const next = vi.fn();

      await DocenteController.obtenerPorId(req, res, next);
      expect(Docente.findByPk).toHaveBeenCalledWith(1);
      expect(res.json).toHaveBeenCalledWith({ data: fakeRecord });
    });

    it('retorna 404 si no existe', async () => {
      const { Docente } = await import('../models/Docente');
      (Docente.findByPk as any).mockResolvedValue(null);

      const req = { params: { id: '999' } } as any;
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any;
      const next = vi.fn();

      await DocenteController.obtenerPorId(req, res, next);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('crear', () => {
    it('crea un nuevo docente', async () => {
      const { Docente } = await import('../models/Docente');
      const fakeCreated = { id_docente: 1, nombre1: 'María' };
      (Docente.create as any).mockResolvedValue(fakeCreated);

      const body = { nombre1: 'María', apellido1: 'López' };
      const req = { body } as any;
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any;
      const next = vi.fn();

      await DocenteController.crear(req, res, next);
      expect(Docente.create).toHaveBeenCalledWith(body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ data: fakeCreated });
    });
  });

  describe('actualizar', () => {
    it('actualiza un docente existente', async () => {
      const { Docente } = await import('../models/Docente');
      const updateMock = vi.fn().mockResolvedValue(undefined);
      const fakeRecord = { id_docente: 1, update: updateMock };
      (Docente.findByPk as any).mockResolvedValue(fakeRecord);

      const body = { nombre1: 'María José' };
      const req = { params: { id: '1' }, body } as any;
      const res = { json: vi.fn() } as any;
      const next = vi.fn();

      await DocenteController.actualizar(req, res, next);
      expect(updateMock).toHaveBeenCalledWith(body);
      expect(res.json).toHaveBeenCalledWith({ data: fakeRecord });
    });

    it('retorna 404 si el docente no existe', async () => {
      const { Docente } = await import('../models/Docente');
      (Docente.findByPk as any).mockResolvedValue(null);

      const req = { params: { id: '999' }, body: {} } as any;
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any;
      const next = vi.fn();

      await DocenteController.actualizar(req, res, next);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('eliminar', () => {
    it('elimina un docente existente', async () => {
      const { Docente } = await import('../models/Docente');
      const destroyMock = vi.fn().mockResolvedValue(undefined);
      const fakeRecord = { id_docente: 1, destroy: destroyMock };
      (Docente.findByPk as any).mockResolvedValue(fakeRecord);

      const req = { params: { id: '1' } } as any;
      const res = { status: vi.fn((code: number) => res), send: vi.fn() } as any;
      const next = vi.fn();

      await DocenteController.eliminar(req, res, next);
      expect(destroyMock).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it('retorna 404 si el docente no existe', async () => {
      const { Docente } = await import('../models/Docente');
      (Docente.findByPk as any).mockResolvedValue(null);

      const req = { params: { id: '999' } } as any;
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any;
      const next = vi.fn();

      await DocenteController.eliminar(req, res, next);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('generarQR', () => {
    it('genera un token QR para el docente', async () => {
      const { Docente } = await import('../models/Docente');
      const saveMock = vi.fn().mockResolvedValue(undefined);
      const fakeRecord = { id_docente: 1, token_qr: null, save: saveMock };
      (Docente.findByPk as any).mockResolvedValue(fakeRecord);

      const req = { params: { id: '1' } } as any;
      const res = { json: vi.fn() } as any;
      const next = vi.fn();

      await DocenteController.generarQR(req, res, next);
      expect(Docente.findByPk).toHaveBeenCalledWith(1);
      expect(fakeRecord.token_qr).toBe('mock-uuid-123');
      expect(saveMock).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ data: { token_qr: 'mock-uuid-123' } });
    });

    it('lanza NotFoundError si el docente no existe', async () => {
      const { Docente } = await import('../models/Docente');
      (Docente.findByPk as any).mockResolvedValue(null);

      const req = { params: { id: '999' } } as any;
      const res = { json: vi.fn() } as any;
      const next = vi.fn();

      await DocenteController.generarQR(req, res, next);
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Docente no encontrado', statusCode: 404 })
      );
    });
  });
});
