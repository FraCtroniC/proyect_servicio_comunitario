import { describe, it, expect, vi } from 'vitest';

vi.mock('../models', () => ({
  AsistenciaDocente: { findOne: vi.fn(), create: vi.fn(), findByPk: vi.fn(), findAndCountAll: vi.fn() },
  Justificacion: {},
  Docente: {},
  sequelize: { query: vi.fn() },
  Sequelize: {},
}));

import { AsistenciaDocenteController } from '../controllers/asistencia-docente.controller';

describe('AsistenciaDocenteController', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  describe('crear', () => {
    it('valida campos requeridos', async () => {
      const req = { body: {}, user: { idUsuario: 1 } } as any;
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any;
      const next = vi.fn();
      await AsistenciaDocenteController.crear(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('valida fecha futura', async () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const fechaStr = tomorrow.toISOString().split('T')[0];
      const req = { body: { id_docente: 1, fecha: fechaStr }, user: { idUsuario: 1 } } as any;
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any;
      const next = vi.fn();
      await AsistenciaDocenteController.crear(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('asigna estatus automaticamente segun hora de entrada', async () => {
      const { AsistenciaDocente } = await import('../models');
      (AsistenciaDocente.findOne as any).mockResolvedValue(null);
      (AsistenciaDocente.create as any).mockResolvedValue({ id_asistencia: 1 });

      const req = { body: { id_docente: 1, fecha: '2026-07-01', hora_entrada: '07:00' }, user: { idUsuario: 1 } } as any;
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any;
      const next = vi.fn();
      await AsistenciaDocenteController.crear(req, res, next);
      expect(AsistenciaDocente.create).toHaveBeenCalledWith(expect.objectContaining({ estatus: 'Puntual', hora_entrada: '07:00' }));
    });

    it('rechaza duplicado', async () => {
      const { AsistenciaDocente } = await import('../models');
      (AsistenciaDocente.findOne as any).mockResolvedValue({ id_asistencia: 1 });

      const req = { body: { id_docente: 1, fecha: '2026-07-01' }, user: { idUsuario: 1 } } as any;
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any;
      const next = vi.fn();
      await AsistenciaDocenteController.crear(req, res, next);
      expect(res.status).toHaveBeenCalledWith(409);
    });
  });

  describe('actualizar', () => {
    it('valida hora_salida posterior a hora_entrada', async () => {
      const { AsistenciaDocente } = await import('../models');
      (AsistenciaDocente.findByPk as any).mockResolvedValue({
        id_asistencia: 1,
        hora_entrada: '08:00',
        hora_salida: null,
        fecha_anulacion: null,
      });

      const req = { params: { id: '1' }, body: { hora_salida: '07:30' }, user: { idUsuario: 1 } } as any;
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any;
      const next = vi.fn();
      await AsistenciaDocenteController.actualizar(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('actualiza exitosamente', async () => {
      const { AsistenciaDocente } = await import('../models');
      const updateMock = vi.fn().mockResolvedValue(undefined);
      (AsistenciaDocente.findByPk as any).mockResolvedValue({
        id_asistencia: 1,
        hora_entrada: '07:00',
        hora_salida: null,
        estatus: 'Puntual',
        fecha_anulacion: null,
        update: updateMock,
      });

      const req = { params: { id: '1' }, body: { hora_salida: '15:00' }, user: { idUsuario: 1 } } as any;
      const res = { json: vi.fn() } as any;
      const next = vi.fn();
      await AsistenciaDocenteController.actualizar(req, res, next);
      expect(updateMock).toHaveBeenCalled();
    });
  });

  describe('eliminar (soft-delete)', () => {
    it('marca fecha_anulacion en lugar de destruir', async () => {
      const { AsistenciaDocente } = await import('../models');
      const updateMock = vi.fn().mockResolvedValue(undefined);
      (AsistenciaDocente.findByPk as any).mockResolvedValue({
        id_asistencia: 1,
        fecha_anulacion: null,
        update: updateMock,
      });

      const req = { params: { id: '1' }, user: { idUsuario: 1 } } as any;
      const res = { status: vi.fn().mockReturnThis(), send: vi.fn() } as any;
      const next = vi.fn();
      await AsistenciaDocenteController.eliminar(req, res, next);
      expect(updateMock).toHaveBeenCalledWith(expect.objectContaining({ fecha_anulacion: expect.any(Date) }));
      expect(res.status).toHaveBeenCalledWith(204);
    });

    it('responde 404 si ya fue anulado', async () => {
      const { AsistenciaDocente } = await import('../models');
      (AsistenciaDocente.findByPk as any).mockResolvedValue({
        id_asistencia: 1,
        fecha_anulacion: new Date(),
      });

      const req = { params: { id: '1' }, user: { idUsuario: 1 } } as any;
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any;
      const next = vi.fn();
      await AsistenciaDocenteController.eliminar(req, res, next);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});
