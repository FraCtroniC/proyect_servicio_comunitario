import { describe, it, expect, vi } from 'vitest';

const { mockCompare, mockGenSalt, mockHash, mockSign, mockVerify, mockSendMail } = vi.hoisted(() => ({
  mockCompare: vi.fn(),
  mockGenSalt: vi.fn(),
  mockHash: vi.fn(),
  mockSign: vi.fn(),
  mockVerify: vi.fn(),
  mockSendMail: vi.fn(),
}));

vi.mock('../models', () => ({
  Usuario: { findOne: vi.fn(), findByPk: vi.fn() },
  Rol: {},
  Docente: {},
}));

vi.mock('../../config/environment', () => ({
  environment: {
    jwtSecret: 'test_secret',
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

import { AuthController } from '../controllers/auth.controller';

describe('AuthController', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  describe('login', () => {
    it('requiere username y password', async () => {
      const req = { body: {} } as any;
      const res = { json: vi.fn() } as any;
      const next = vi.fn();
      await AuthController.login(req, res, next);
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ message: expect.stringContaining('requeridos'), statusCode: 400 })
      );
    });

    it('rechaza credenciales inválidas', async () => {
      const { Usuario } = await import('../models');
      (Usuario.findOne as any).mockResolvedValue(null);
      const req = { body: { username: 'test', password: 'wrong' } } as any;
      const res = { json: vi.fn() } as any;
      const next = vi.fn();
      await AuthController.login(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 401 }));
    });

    it('rechaza usuario inactivo', async () => {
      const { Usuario } = await import('../models');
      (Usuario.findOne as any).mockResolvedValue({ estatus: 'Inactivo', password_hash: 'hash' } as any);
      const req = { body: { username: 'test', password: 'pass' } } as any;
      const res = { json: vi.fn() } as any;
      const next = vi.fn();
      await AuthController.login(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 403 }));
    });

    it('autentica usuario válido y retorna token', async () => {
      const { Usuario } = await import('../models');
      mockCompare.mockResolvedValue(true);
      mockSign.mockReturnValue('mock-token');
      (Usuario.findOne as any).mockResolvedValue({
        id_usuario: 1, id_rol: 2, username: 'admin', estatus: 'Activo',
        password_hash: 'hashed', ultimo_acceso: null,
        save: vi.fn().mockResolvedValue(undefined),
        rol: { nombre: 'Admin' }, docente: null,
      } as any);

      const req = { body: { username: 'admin', password: 'pass' } } as any;
      const res = { json: vi.fn() } as any;
      const next = vi.fn();

      await AuthController.login(req, res, next);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        ok: true, token: 'mock-token',
        user: expect.objectContaining({ userName: 'admin', rol: 'Admin', idRol: 2 }),
      }));
    });
  });

  describe('solicitarRecuperacion', () => {
    it('requiere correo', async () => {
      const req = { body: {} } as any;
      const res = { json: vi.fn() } as any;
      const next = vi.fn();
      await AuthController.solicitarRecuperacion(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 400 }));
    });

    it('rechaza correo no registrado', async () => {
      const { Usuario } = await import('../models');
      (Usuario.findOne as any).mockResolvedValue(null);
      const req = { body: { correo: 'no@test.com' } } as any;
      const res = { json: vi.fn() } as any;
      const next = vi.fn();
      await AuthController.solicitarRecuperacion(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 404 }));
    });

    it('envía correo de recuperación', async () => {
      const { Usuario } = await import('../models');
      mockSign.mockReturnValue('reset-token');
      mockSendMail.mockResolvedValue({ messageId: 'mock-id' });
      (Usuario.findOne as any).mockResolvedValue({
        username: 'test', correo: 'test@test.com', docente: null,
      } as any);

      const req = { body: { correo: 'test@test.com' } } as any;
      const res = { json: vi.fn() } as any;
      const next = vi.fn();

      await AuthController.solicitarRecuperacion(req, res, next);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        ok: true, message: 'Correo enviado con éxito.',
      }));
    });
  });

  describe('restablecerPassword', () => {
    it('requiere token y password', async () => {
      const req = { body: {} } as any;
      const res = { json: vi.fn() } as any;
      const next = vi.fn();
      await AuthController.restablecerPassword(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 400 }));
    });

    it('actualiza la contraseña con token válido', async () => {
      const { Usuario } = await import('../models');
      mockVerify.mockReturnValue({ idUsuario: 1, purpose: 'password_reset' });
      mockGenSalt.mockResolvedValue('salt');
      mockHash.mockResolvedValue('new-hash');

      const user = { id_usuario: 1, password_hash: 'old', save: vi.fn().mockResolvedValue(undefined) };
      (Usuario.findByPk as any).mockResolvedValue(user);

      const req = { body: { token: 'valid', password: 'new-pass' } } as any;
      const res = { json: vi.fn() } as any;
      const next = vi.fn();

      await AuthController.restablecerPassword(req, res, next);
      expect(user.password_hash).toBe('new-hash');
      expect(user.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ ok: true }));
    });

    it('rechaza token expirado', async () => {
      mockVerify.mockImplementation(() => {
        const err: any = new Error('jwt expired');
        err.name = 'TokenExpiredError';
        throw err;
      });

      const req = { body: { token: 'expired', password: 'new-pass' } } as any;
      const res = { json: vi.fn() } as any;
      const next = vi.fn();

      await AuthController.restablecerPassword(req, res, next);
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ message: expect.stringContaining('expirado'), statusCode: 400 })
      );
    });
  });
});
