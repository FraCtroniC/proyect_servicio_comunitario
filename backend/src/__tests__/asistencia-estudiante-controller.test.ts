import { describe, it, expect, vi } from 'vitest';

vi.mock('../models', () => ({
  AsistenciaEstudiante: { findOne: vi.fn(), create: vi.fn(), findByPk: vi.fn(), findAndCountAll: vi.fn(), findOrCreate: vi.fn(), count: vi.fn() },
  Matricula: {},
  Estudiante: {},
  Seccion: {},
  Calificacion: { update: vi.fn() },
  PeriodoEscolar: { findOne: vi.fn(), findByPk: vi.fn() },
  sequelize: { transaction: vi.fn((cb: any) => cb({})), query: vi.fn() },
  Sequelize: {},
}));

import { AsistenciaEstudianteController } from '../controllers/asistencia-estudiante.controller';

describe('AsistenciaEstudianteController', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  describe('crear', () => {
    it('valida que id_matricula y fecha sean requeridos', async () => {
      const req = { body: {}, user: { idUsuario: 1 } } as any;
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any;
      const next = vi.fn();
      await AsistenciaEstudianteController.crear(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.objectContaining({ message: 'Error de validación' }) }));
    });

    it('valida que fecha no sea futura', async () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const fechaStr = tomorrow.toISOString().split('T')[0];
      const req = { body: { id_matricula: 1, fecha: fechaStr }, user: { idUsuario: 1 } } as any;
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any;
      const next = vi.fn();
      await AsistenciaEstudianteController.crear(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('valida estatus', async () => {
      const req = { body: { id_matricula: 1, fecha: '2026-07-01', estatus: 'Invalido' }, user: { idUsuario: 1 } } as any;
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any;
      const next = vi.fn();
      await AsistenciaEstudianteController.crear(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('crea asistencia exitosamente', async () => {
      const { AsistenciaEstudiante } = await import('../models');
      (AsistenciaEstudiante.findOne as any).mockResolvedValue(null);
      (AsistenciaEstudiante.create as any).mockResolvedValue({ id_asistencia_est: 1, id_matricula: 1, fecha: '2026-07-01', estatus: 'Presente' });
      (AsistenciaEstudiante.findByPk as any).mockResolvedValue({ id_asistencia_est: 1, id_matricula: 1, fecha: '2026-07-01', estatus: 'Presente' });

      const req = { body: { id_matricula: 1, fecha: '2026-07-01', estatus: 'Presente' }, user: { idUsuario: 1 } } as any;
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any;
      const next = vi.fn();
      await AsistenciaEstudianteController.crear(req, res, next);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(AsistenciaEstudiante.create).toHaveBeenCalled();
    });

    it('rechaza duplicado', async () => {
      const { AsistenciaEstudiante } = await import('../models');
      (AsistenciaEstudiante.findOne as any).mockResolvedValue({ id_asistencia_est: 1 });

      const req = { body: { id_matricula: 1, fecha: '2026-07-01' }, user: { idUsuario: 1 } } as any;
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any;
      const next = vi.fn();
      await AsistenciaEstudianteController.crear(req, res, next);
      expect(res.status).toHaveBeenCalledWith(409);
    });
  });

  describe('crearBatch', () => {
    it('valida que registros sea un array no vacío', async () => {
      const req = { body: {}, user: { idUsuario: 1 } } as any;
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any;
      const next = vi.fn();
      await AsistenciaEstudianteController.crearBatch(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('crea registros batch exitosamente', async () => {
      const { AsistenciaEstudiante, sequelize } = await import('../models');
      const updateMock = vi.fn().mockResolvedValue(undefined);
      (sequelize.transaction as any).mockImplementation((cb: any) => cb({}));
      (AsistenciaEstudiante.findOrCreate as any).mockImplementation(({ defaults }: any) => {
        return [{ id_asistencia_est: defaults.id_matricula, ...defaults, update: updateMock }, false];
      });
      (AsistenciaEstudiante.findByPk as any).mockImplementation((id: number) => ({ id_asistencia_est: id }));

      const req = {
        body: { registros: [{ id_matricula: 1, fecha: '2026-07-01', estatus: 'Presente' }] },
        user: { idUsuario: 1 }
      } as any;
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any;
      const next = vi.fn();
      await AsistenciaEstudianteController.crearBatch(req, res, next);
      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe('actualizar', () => {
    it('responde 404 si no existe', async () => {
      const { AsistenciaEstudiante } = await import('../models');
      (AsistenciaEstudiante.findByPk as any).mockResolvedValue(null);

      const req = { params: { id: '999' }, body: { estatus: 'Presente' }, user: { idUsuario: 1 } } as any;
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any;
      const next = vi.fn();
      await AsistenciaEstudianteController.actualizar(req, res, next);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('actualiza exitosamente', async () => {
      const { AsistenciaEstudiante } = await import('../models');
      const updateMock = vi.fn().mockResolvedValue(undefined);
      (AsistenciaEstudiante.findByPk as any).mockResolvedValue({ id_asistencia_est: 1, update: updateMock });
      (AsistenciaEstudiante.findByPk as any).mockResolvedValue({ id_asistencia_est: 1, estatus: 'Justificado', update: updateMock });

      const req = { params: { id: '1' }, body: { estatus: 'Justificado' }, user: { idUsuario: 1 } } as any;
      const res = { json: vi.fn() } as any;
      const next = vi.fn();
      await AsistenciaEstudianteController.actualizar(req, res, next);
      expect(updateMock).toHaveBeenCalled();
    });
  });

  describe('eliminar', () => {
    it('responde 404 si no existe', async () => {
      const { AsistenciaEstudiante } = await import('../models');
      (AsistenciaEstudiante.findByPk as any).mockResolvedValue(null);

      const req = { params: { id: '999' }, user: { idUsuario: 1 } } as any;
      const res = { status: vi.fn().mockReturnThis(), send: vi.fn() } as any;
      const next = vi.fn();
      await AsistenciaEstudianteController.eliminar(req, res, next);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('elimina exitosamente', async () => {
      const { AsistenciaEstudiante } = await import('../models');
      const destroyMock = vi.fn().mockResolvedValue(undefined);
      (AsistenciaEstudiante.findByPk as any).mockResolvedValue({ id_asistencia_est: 1, destroy: destroyMock });

      const req = { params: { id: '1' }, user: { idUsuario: 1 } } as any;
      const res = { status: vi.fn().mockReturnThis(), send: vi.fn() } as any;
      const next = vi.fn();
      await AsistenciaEstudianteController.eliminar(req, res, next);
      expect(destroyMock).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(204);
    });
  });
});
