import { describe, it, expect, vi } from 'vitest';

vi.mock('../models', () => ({
  Calificacion: { findAll: vi.fn(), findByPk: vi.fn(), create: vi.fn(), findOrCreate: vi.fn() },
  Matricula: { findOne: vi.fn() },
  PlanEstudio: {},
  Asignatura: {},
  EscalaCalificacion: {},
}));

import { CalificacionController } from '../controllers/calificacion.controller';

describe('CalificacionController', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  describe('bulkUpsert', () => {
    it('valida que calificaciones sea un arreglo', async () => {
      const req = { body: { calificaciones: 'invalido' } } as any;
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any;
      const next = vi.fn();

      await CalificacionController.bulkUpsert(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: { message: 'Calificaciones debe ser un arreglo' } });
    });

    it('procesa calificaciones con id_matricula directo', async () => {
      const { Calificacion } = await import('../models');
      const updateMock = vi.fn().mockResolvedValue(undefined);
      const fakeRecord = { id_calificacion: 1, update: updateMock };
      (Calificacion.findOrCreate as any).mockResolvedValue([fakeRecord, false]);
      (Calificacion.findByPk as any).mockResolvedValue(fakeRecord);

      const calItem = { id_matricula: 10, id_plan: 1, id_momento: 1, id_escala: 15, inasistencias_asignatura: 2 };
      const req = { body: { calificaciones: [calItem] } } as any;
      const res = { json: vi.fn() } as any;
      const next = vi.fn();

      await CalificacionController.bulkUpsert(req, res, next);
      expect(Calificacion.findOrCreate).toHaveBeenCalledWith({
        where: { id_matricula: 10, id_plan: 1, id_momento: 1 },
        defaults: { id_escala: 15, inasistencias_asignatura: 2 },
      });
      expect(updateMock).toHaveBeenCalledWith({ id_escala: 15, inasistencias_asignatura: 2 });
    });

    it('fallback a id_estudiante si no hay id_matricula', async () => {
      const { Calificacion, Matricula } = await import('../models');
      const updateMock = vi.fn().mockResolvedValue(undefined);
      const fakeRecord = { id_calificacion: 2, update: updateMock };
      (Calificacion.findOrCreate as any).mockResolvedValue([fakeRecord, false]);
      (Calificacion.findByPk as any).mockResolvedValue(fakeRecord);
      (Matricula.findOne as any).mockResolvedValue({ id_matricula: 20 });

      const calItem = { id_estudiante: 5, id_plan: 2, id_momento: 1, id_escala: 18 };
      const req = { body: { calificaciones: [calItem] } } as any;
      const res = { json: vi.fn() } as any;
      const next = vi.fn();

      await CalificacionController.bulkUpsert(req, res, next);
      expect(Matricula.findOne).toHaveBeenCalledWith({ where: { id_estudiante: 5 } });
    });

    it('salta estudiantes sin matricula en fallback', async () => {
      const { Matricula } = await import('../models');
      (Matricula.findOne as any).mockResolvedValue(null);

      const calItem = { id_estudiante: 999, id_plan: 1, id_momento: 1, id_escala: 15 };
      const req = { body: { calificaciones: [calItem] } } as any;
      const res = { json: vi.fn() } as any;
      const next = vi.fn();

      await CalificacionController.bulkUpsert(req, res, next);
      expect(res.json).toHaveBeenCalledWith({ data: [] });
    });
  });

  describe('listar', () => {
    it('filtra por query params', async () => {
      const { Calificacion } = await import('../models');
      (Calificacion.findAll as any).mockResolvedValue([]);

      const req = { query: { id_plan: '1', id_momento: '2', id_matricula: '3' } } as any;
      const res = { json: vi.fn() } as any;
      const next = vi.fn();

      await CalificacionController.listar(req, res, next);
      expect(Calificacion.findAll).toHaveBeenCalledWith(expect.objectContaining({
        where: { id_plan: 1, id_momento: 2, id_matricula: 3 },
      }));
    });
  });
});
