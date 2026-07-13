import { describe, it, expect, vi } from 'vitest';

vi.mock('../models', () => ({
  Justificacion: { findAll: vi.fn(), findByPk: vi.fn(), create: vi.fn() },
  AsistenciaDocente: { findByPk: vi.fn() },
  Docente: {},
  sequelize: { transaction: vi.fn((cb: any) => cb({})) },
  Sequelize: {},
}));

import { JustificacionController } from '../controllers/justificacion.controller';

describe('JustificacionController', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  describe('crear', () => {
    it('valida campos requeridos', async () => {
      const req = { body: {} } as any;
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any;
      const next = vi.fn();
      await JustificacionController.crear(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('valida motivo no vacío', async () => {
      const req = { body: { id_asistencia: 1, motivo: '' } } as any;
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any;
      const next = vi.fn();
      await JustificacionController.crear(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('responde 404 si asistencia no existe', async () => {
      const { AsistenciaDocente } = await import('../models');
      (AsistenciaDocente.findByPk as any).mockResolvedValue(null);

      const req = { body: { id_asistencia: 999, motivo: 'Enfermedad' } } as any;
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any;
      const next = vi.fn();
      await JustificacionController.crear(req, res, next);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('crea justificación y actualiza estatus atómicamente', async () => {
      const { Justificacion, AsistenciaDocente, sequelize } = await import('../models');
      const updateMock = vi.fn().mockResolvedValue(undefined);
      (AsistenciaDocente.findByPk as any).mockResolvedValue({
        id_asistencia: 1,
        estatus: 'Ausente',
        fecha_anulacion: null,
        update: updateMock,
      });
      (Justificacion.create as any).mockResolvedValue({ id_justificacion: 1 });
      (sequelize.transaction as any).mockImplementation((cb: any) => cb({}));

      const req = { body: { id_asistencia: 1, motivo: 'Enfermedad' } } as any;
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any;
      const next = vi.fn();
      await JustificacionController.crear(req, res, next);
      expect(Justificacion.create).toHaveBeenCalled();
      expect(updateMock).toHaveBeenCalledWith({ estatus: 'Justificado' }, { transaction: {} });
      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe('eliminar', () => {
    it('revierte estatus a Ausente al eliminar justificación', async () => {
      const { Justificacion, AsistenciaDocente, sequelize } = await import('../models');
      const updateMock = vi.fn().mockResolvedValue(undefined);
      const destroyMock = vi.fn().mockResolvedValue(undefined);
      (Justificacion.findByPk as any).mockResolvedValue({
        id_justificacion: 1,
        id_asistencia: 1,
        destroy: destroyMock,
      });
      (AsistenciaDocente.findByPk as any).mockResolvedValue({
        id_asistencia: 1,
        estatus: 'Justificado',
        update: updateMock,
      });
      (sequelize.transaction as any).mockImplementation((cb: any) => cb({}));

      const req = { params: { id: '1' } } as any;
      const res = { status: vi.fn().mockReturnThis(), send: vi.fn() } as any;
      const next = vi.fn();
      await JustificacionController.eliminar(req, res, next);
      expect(updateMock).toHaveBeenCalledWith({ estatus: 'Ausente' }, { transaction: {} });
      expect(destroyMock).toHaveBeenCalledWith({ transaction: {} });
      expect(res.status).toHaveBeenCalledWith(204);
    });
  });
});
