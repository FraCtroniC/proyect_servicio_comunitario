import { describe, it, expect, vi } from 'vitest';

const { mockCompare, mockGenSalt, mockHash, mockSign, mockVerify, mockSendMail, mockRandomUUID, mockFindByPk, mockFindOne } = vi.hoisted(() => ({
  mockCompare: vi.fn(),
  mockGenSalt: vi.fn(),
  mockHash: vi.fn(),
  mockSign: vi.fn(),
  mockVerify: vi.fn(),
  mockSendMail: vi.fn(),
  mockRandomUUID: vi.fn(() => 'mock-refresh-token-uuid'),
  mockFindByPk: vi.fn(),
  mockFindOne: vi.fn(),
}));

vi.mock('../models', () => ({
  Usuario: {
    findOne: mockFindOne,
    findByPk: mockFindByPk,
    increment: vi.fn(),
    update: vi.fn(),
  },
  Rol: {},
  Docente: {},
  LoginAudit: { create: vi.fn() },
  RefreshToken: { create: vi.fn(), findOne: vi.fn(), update: vi.fn() },
}));

vi.mock('../../config/environment', () => ({
  environment: {
    jwtSecret: 'test_secret',
    jwtLegacySecrets: '',
    nodeEnv: 'test',
    smtp: { host: 'smtp.test.com', port: 587, user: 'test', pass: 'test', from: 'test@test.com' },
    frontendUrl: 'http://localhost:5173',
  },
}));

vi.mock('bcrypt', () => ({
  default: { compare: mockCompare, genSalt: mockGenSalt, hash: mockHash },
}));

vi.mock('jsonwebtoken', () => ({
  default: { sign: mockSign, verify: mockVerify },
}));

vi.mock('nodemailer', () => ({
  default: {
    createTransport: vi.fn(() => ({ sendMail: mockSendMail })),
  },
}));

vi.mock('crypto', () => ({
  default: {
    randomUUID: mockRandomUUID,
    createHash: vi.fn(() => ({
      update: vi.fn().mockReturnThis(),
      digest: vi.fn(() => 'mocked-hash'),
    })),
  },
}));

import { AuthController } from '../controllers/auth.controller';

describe('AuthController', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  describe('obtenerCsrfToken', () => {
    it('retorna ok', async () => {
      const req = { cookies: {} } as any;
      const res = { json: vi.fn(), cookie: vi.fn() } as any;
      await AuthController.obtenerCsrfToken(req, res);
      expect(res.json).toHaveBeenCalledWith({ ok: true });
    });
  });

  describe('login', () => {
    it('requiere username y password', async () => {
      const req = { body: {}, ip: '127.0.0.1', socket: { remoteAddress: '127.0.0.1' }, headers: {}, cookies: {} } as any;
      const res = { json: vi.fn(), cookie: vi.fn(), clearCookie: vi.fn() } as any;
      const next = vi.fn();
      await AuthController.login(req, res, next);
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ message: expect.stringContaining('requeridos'), statusCode: 400 })
      );
    });

    it('rechaza credenciales inválidas con delay', async () => {
      mockFindOne.mockResolvedValue({
        id_usuario: 1, username: 'test', estatus: 'Activo',
        password_hash: 'hash', failed_attempts: 0, locked_until: null,
      });
      mockCompare.mockResolvedValue(false);
      const start = Date.now();
      const req = { body: { username: 'test', password: 'wrong' }, ip: '127.0.0.1', socket: { remoteAddress: '127.0.0.1' }, headers: { 'user-agent': 'test' }, cookies: {} } as any;
      const res = { json: vi.fn(), cookie: vi.fn(), clearCookie: vi.fn() } as any;
      const next = vi.fn();
      await AuthController.login(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 401 }));
      expect(Date.now() - start).toBeGreaterThanOrEqual(300);
    });

    it('autentica usuario válido y retorna token + cookies', async () => {
      mockFindOne
        .mockResolvedValueOnce({
          id_usuario: 1, username: 'admin', estatus: 'Activo', locked_until: null,
        })
        .mockResolvedValueOnce({
          id_usuario: 1, id_rol: 2, username: 'admin', estatus: 'Activo',
          password_hash: 'hashed', ultimo_acceso: null,
          failed_attempts: 0, locked_until: null,
          save: vi.fn().mockResolvedValue(undefined),
          rol: { nombre: 'Admin' }, docente: null,
        });
      mockFindByPk.mockResolvedValue({
        getDataValue: () => 0,
      });
      mockCompare.mockResolvedValue(true);
      mockSign.mockReturnValue('mock-access-token');

      const { RefreshToken } = await import('../models');
      const req = { body: { username: 'admin', password: 'pass' }, ip: '127.0.0.1', socket: { remoteAddress: '127.0.0.1' }, headers: { 'user-agent': 'test' }, cookies: {} } as any;
      const res = { json: vi.fn(), cookie: vi.fn(), clearCookie: vi.fn() } as any;
      const next = vi.fn();

      await AuthController.login(req, res, next);
      expect(RefreshToken.create).toHaveBeenCalled();
      expect(res.cookie).toHaveBeenCalledTimes(2);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        ok: true, token: 'mock-access-token',
        user: expect.objectContaining({ userName: 'admin' }),
      }));
    });
  });

  describe('refresh', () => {
    it('rechaza sin refresh token cookie', async () => {
      const req = { cookies: {} } as any;
      const res = { json: vi.fn(), cookie: vi.fn(), clearCookie: vi.fn() } as any;
      const next = vi.fn();
      await AuthController.refresh(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 401 }));
    });

    it('renueva tokens con refresh válido', async () => {
      const { RefreshToken } = await import('../models');
      const futureDate = new Date(Date.now() + 86400000);
      (RefreshToken.findOne as any).mockResolvedValue({
        id_usuario: 1,
        expires_at: futureDate,
        update: vi.fn().mockResolvedValue(undefined),
      });
      mockFindByPk
        .mockResolvedValueOnce({
          id_usuario: 1, id_rol: 2, username: 'admin', estatus: 'Activo',
          rol: { nombre: 'Admin' },
        })
        .mockResolvedValueOnce({
          getDataValue: () => 0,
        });
      mockSign.mockReturnValue('new-access-token');

      const req = { cookies: { refresh_token: 'valid-refresh' } } as any;
      const res = { json: vi.fn(), cookie: vi.fn(), clearCookie: vi.fn() } as any;
      const next = vi.fn();

      await AuthController.refresh(req, res, next);
      expect(RefreshToken.create).toHaveBeenCalled();
      expect(res.cookie).toHaveBeenCalledTimes(2);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ ok: true }));
    });
  });

  describe('logout', () => {
    it('revoca refresh token, incrementa token_version y limpia cookies', async () => {
      const { RefreshToken } = await import('../models');
      const req = { cookies: { refresh_token: 'some-token' } } as any;
      const res = { json: vi.fn(), cookie: vi.fn(), clearCookie: vi.fn() } as any;
      const next = vi.fn();

      await AuthController.logout(req, res, next);
      expect(RefreshToken.update).toHaveBeenCalled();
      expect(res.clearCookie).toHaveBeenCalledTimes(2);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ ok: true }));
    });
  });

  describe('solicitarRecuperacion', () => {
    it('rechaza correo inválido con Zod', async () => {
      const req = { body: { correo: 'invalido' } } as any;
      const res = { json: vi.fn() } as any;
      const next = vi.fn();
      await AuthController.solicitarRecuperacion(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 400 }));
    });

    it('envía correo de recuperación', async () => {
      mockSign.mockReturnValue('reset-token');
      mockSendMail.mockResolvedValue({ messageId: 'mock-id' });
      mockFindOne.mockResolvedValue({
        username: 'test', correo: 'test@test.com', docente: null,
      });

      const req = { body: { correo: 'test@test.com' } } as any;
      const res = { json: vi.fn() } as any;
      const next = vi.fn();

      await AuthController.solicitarRecuperacion(req, res, next);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ ok: true }));
    });
  });

  describe('restablecerPassword', () => {
    it('rechaza contraseña corta con Zod', async () => {
      const req = { body: { token: 'x', password: '12' } } as any;
      const res = { json: vi.fn() } as any;
      const next = vi.fn();
      await AuthController.restablecerPassword(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 400 }));
    });

    it('actualiza la contraseña con token válido y envía notificación', async () => {
      mockVerify.mockReturnValue({ idUsuario: 1, purpose: 'password_reset' });
      mockGenSalt.mockResolvedValue('salt');
      mockHash.mockResolvedValue('new-hash');

      const user = {
        id_usuario: 1, password_hash: 'old', correo: 'test@test.com',
        docente: null, save: vi.fn().mockResolvedValue(undefined),
      };
      mockFindByPk.mockResolvedValue(user);

      const req = { body: { token: 'valid', password: 'new-pass-ok' } } as any;
      const res = { json: vi.fn() } as any;
      const next = vi.fn();

      await AuthController.restablecerPassword(req, res, next);
      expect(user.password_hash).toBe('new-hash');
      expect(mockSendMail).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ ok: true }));
    });
  });

  describe('cambiarPassword', () => {
    it('rechaza contraseña nueva corta con Zod', async () => {
      const req = { user: { idUsuario: 1 }, body: { currentPassword: 'old', newPassword: '12' } } as any;
      const res = { json: vi.fn() } as any;
      const next = vi.fn();
      await AuthController.cambiarPassword(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 400 }));
    });

    it('cambia contraseña y envía notificación', async () => {
      mockCompare.mockResolvedValue(true);
      mockGenSalt.mockResolvedValue('salt');
      mockHash.mockResolvedValue('new-hash');

      const user = {
        id_usuario: 1, password_hash: 'old', correo: 'test@test.com',
        docente: null, save: vi.fn().mockResolvedValue(undefined),
      };
      mockFindByPk.mockResolvedValue(user);

      const req = { user: { idUsuario: 1 }, body: { currentPassword: 'old', newPassword: 'new-pass-ok' } } as any;
      const res = { json: vi.fn() } as any;
      const next = vi.fn();

      await AuthController.cambiarPassword(req, res, next);
      expect(user.password_hash).toBe('new-hash');
      expect(mockSendMail).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ data: { message: expect.any(String) } }));
    });
  });
});
