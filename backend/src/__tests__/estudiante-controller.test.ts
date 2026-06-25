import { describe, it, expect, vi } from 'vitest';
import { EstudianteController } from '../controllers/estudiante.controller';

vi.mock('../models/Estudiante', () => ({
  Estudiante: {
    findAll: vi.fn(),
    findByPk: vi.fn(),
    create: vi.fn(),
  },
}));

import { Estudiante } from '../models/Estudiante';

describe('EstudianteController', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('listar', () => {
    it('retorna todos los estudiantes con representante', async () => {
      const fakeData = [{ id_estudiante: 1, nombre1: 'Juan' }];
      (Estudiante.findAll as any).mockResolvedValue(fakeData);

      const req = {} as any;
      const res = { json: vi.fn() } as any;
      const next = vi.fn();

      await EstudianteController.listar(req, res, next);
      expect(Estudiante.findAll).toHaveBeenCalledWith({ include: ['representante'] });
      expect(res.json).toHaveBeenCalledWith({ data: fakeData });
    });

    it('maneja errores del modelo', async () => {
      const error = new Error('DB error');
      (Estudiante.findAll as any).mockImplementation(() => Promise.reject(error));

      const req = {} as any;
      const res = { json: vi.fn() } as any;
      const next = vi.fn();

      await EstudianteController.listar(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('obtenerPorId', () => {
    it('retorna estudiante por ID', async () => {
      const fakeRecord = { id_estudiante: 1, nombre1: 'Juan' };
      (Estudiante.findByPk as any).mockResolvedValue(fakeRecord);

      const req = { params: { id: '1' } } as any;
      const res = { json: vi.fn() } as any;
      const next = vi.fn();

      await EstudianteController.obtenerPorId(req, res, next);
      expect(Estudiante.findByPk).toHaveBeenCalledWith(1);
      expect(res.json).toHaveBeenCalledWith({ data: fakeRecord });
    });

    it('retorna 404 si no existe', async () => {
      (Estudiante.findByPk as any).mockResolvedValue(null);

      const req = { params: { id: '999' } } as any;
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any;
      const next = vi.fn();

      await EstudianteController.obtenerPorId(req, res, next);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: { message: 'Recurso no encontrado' } });
    });
  });

  describe('crear', () => {
    it('crea un nuevo estudiante', async () => {
      const fakeCreated = { id_estudiante: 1, nombre1: 'Juan' };
      (Estudiante.create as any).mockResolvedValue(fakeCreated);

      const body = { nombre1: 'Juan', apellido1: 'Pérez' };
      const req = { body } as any;
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any;
      const next = vi.fn();

      await EstudianteController.crear(req, res, next);
      expect(Estudiante.create).toHaveBeenCalledWith(body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ data: fakeCreated });
    });
  });

  describe('actualizar', () => {
    it('actualiza un estudiante existente', async () => {
      const fakeRecord = {
        id_estudiante: 1,
        update: vi.fn().mockResolvedValue(undefined),
      };
      (Estudiante.findByPk as any).mockResolvedValue(fakeRecord);

      const body = { nombre1: 'Juan Carlos' };
      const req = { params: { id: '1' }, body } as any;
      const res = { json: vi.fn() } as any;
      const next = vi.fn();

      await EstudianteController.actualizar(req, res, next);
      expect(fakeRecord.update).toHaveBeenCalledWith(body);
      expect(res.json).toHaveBeenCalledWith({ data: fakeRecord });
    });

    it('retorna 404 si el estudiante no existe', async () => {
      (Estudiante.findByPk as any).mockResolvedValue(null);

      const req = { params: { id: '999' }, body: {} } as any;
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any;
      const next = vi.fn();

      await EstudianteController.actualizar(req, res, next);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: { message: 'Recurso no encontrado' } });
    });
  });

  describe('eliminar', () => {
    it('elimina un estudiante existente', async () => {
      const fakeRecord = {
        id_estudiante: 1,
        destroy: vi.fn().mockResolvedValue(undefined),
      };
      (Estudiante.findByPk as any).mockResolvedValue(fakeRecord);

      const req = { params: { id: '1' } } as any;
      const res = { status: vi.fn((code: number) => res), send: vi.fn() } as any;
      const next = vi.fn();

      await EstudianteController.eliminar(req, res, next);
      expect(fakeRecord.destroy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it('retorna 404 si el estudiante no existe', async () => {
      (Estudiante.findByPk as any).mockResolvedValue(null);

      const req = { params: { id: '999' } } as any;
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any;
      const next = vi.fn();

      await EstudianteController.eliminar(req, res, next);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: { message: 'Recurso no encontrado' } });
    });
  });
});
