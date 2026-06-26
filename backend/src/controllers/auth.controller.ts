import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { Op } from 'sequelize';
import { Usuario as UsuarioModel, Rol, Docente } from '../models';
import { environment } from '../../config/environment';
import { AppError } from '../shared/errors';
import { wrapAsync } from '../shared/utils/wrapAsync';

// Bloqueo de cuenta por intentos fallidos (en memoria, no toca la DB)
const loginAttempts = new Map<string, { count: number; lockUntil: number }>();
const MAX_ATTEMPTS = 5;
const LOCK_DURATION = 15 * 60 * 1000;

function checkLoginLock(username: string): number | null {
  const record = loginAttempts.get(username);
  if (!record) return null;
  if (Date.now() > record.lockUntil) {
    loginAttempts.delete(username);
    return null;
  }
  const remaining = Math.ceil((record.lockUntil - Date.now()) / 60000);
  return remaining;
}

function recordFailedAttempt(username: string) {
  const record = loginAttempts.get(username) || { count: 0, lockUntil: 0 };
  record.count += 1;
  if (record.count >= MAX_ATTEMPTS) {
    record.lockUntil = Date.now() + LOCK_DURATION;
  }
  loginAttempts.set(username, record);
}

function clearLoginAttempts(username: string) {
  loginAttempts.delete(username);
}

// Configuración del transportador de correo
const transporter = nodemailer.createTransport({
  host: environment.smtp.host,
  port: environment.smtp.port,
  secure: environment.smtp.port === 465, // true para 465, false para otros
  auth: {
    user: environment.smtp.user,
    pass: environment.smtp.pass,
  },
});

export const AuthController = {
  login: wrapAsync(async (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (!username || !password) {
      throw new AppError('El usuario y la contraseña son requeridos', 400);
    }

    const usernameKey = username.toLowerCase();

    // Verificar bloqueo temporal por intentos fallidos
    const lockRemaining = checkLoginLock(usernameKey);
    if (lockRemaining !== null) {
      throw new AppError(`Demasiados intentos fallidos. Cuenta bloqueada por ${lockRemaining} minuto(s).`, 429);
    }

    // Buscar el usuario en la base de datos e incluir Rol y Docente
    const usuario = await UsuarioModel.findOne({
      where: { username: usernameKey },
      include: [
        { model: Rol, as: 'rol' },
        { model: Docente, as: 'docente' }
      ]
    });

    if (!usuario) {
      recordFailedAttempt(usernameKey);
      throw new AppError('Usuario o contraseña incorrectos', 401);
    }

    if (usuario.estatus !== 'Activo') {
      recordFailedAttempt(usernameKey);
      throw new AppError('Esta cuenta está inactiva o bloqueada. Comuníquese con el administrador.', 403);
    }

    // Verificar contraseña
    const passwordMatch = await bcrypt.compare(password, usuario.password_hash);
    if (!passwordMatch) {
      recordFailedAttempt(usernameKey);
      throw new AppError('Usuario o contraseña incorrectos', 401);
    }

    // Limpiar intentos fallidos al iniciar sesión exitosamente
    clearLoginAttempts(usernameKey);

    // Construir displayName amistoso
    let displayName = usuario.username;
    if (usuario.docente) {
      const d = usuario.docente as any;
      displayName = `${d.nombre1} ${d.apellido1}`;
    } else if (usuario.rol) {
      displayName = (usuario.rol as any).nombre;
    }

    // Generar token JWT
    const token = jwt.sign(
      {
        idUsuario: usuario.id_usuario,
        username: usuario.username,
        idRol: usuario.id_rol,
        rol: usuario.rol ? (usuario.rol as any).nombre : null,
      },
      environment.jwtSecret,
      { expiresIn: '2h' }
    );

    // Actualizar último acceso
    usuario.ultimo_acceso = new Date();
    await usuario.save();

    res.json({
      ok: true,
      token,
      user: {
        userName: usuario.username,
        displayName,
        idRol: usuario.id_rol,
        rol: usuario.rol ? (usuario.rol as any).nombre : null,
      }
    });
  }),

  solicitarRecuperacion: wrapAsync(async (req: Request, res: Response) => {
    const { correo } = req.body;

    if (!correo) {
      throw new AppError('El correo electrónico es requerido', 400);
    }

    // Buscamos el correo tanto en la tabla de Usuarios como en la de Docentes (vía asociación)
    const usuario = await UsuarioModel.findOne({
      where: {
        [Op.or]: [
          { correo: correo.toLowerCase() },
          { '$docente.correo$': correo.toLowerCase() }
        ]
      },
      include: [
        { model: Docente, as: 'docente', required: false }
      ]
    });

    if (!usuario) {
      console.log(`[Auth] Intento de recuperación fallido: correo ${correo} no encontrado en la DB.`);
      throw new AppError('El correo electrónico no se encuentra registrado en el sistema.', 404);
    }

    // Determinamos el destinatario (priorizamos el de la tabla usuarios, luego el del docente vinculado)
    const correoDestino = usuario.correo || (usuario.docente ? (usuario.docente as any).correo : null);

    if (!correoDestino) {
      console.log(`[Auth] Usuario ${usuario.username} encontrado pero no tiene un correo válido definido.`);
      throw new AppError('El usuario encontrado no tiene un correo electrónico válido asociado para la recuperación.', 400);
    }

    // Generar un token temporal para el enlace de recuperación (expira en 1 hora)
    const resetToken = jwt.sign(
      { idUsuario: usuario.id_usuario, purpose: 'password_reset' },
      environment.jwtSecret,
      { expiresIn: '1h' }
    );

    const resetLink = `${environment.frontendUrl.trim().replace(/\/$/, '')}/forgot-password?token=${resetToken}`;

    try {
      await transporter.sendMail({
        from: `"Soporte Liceo" <${environment.smtp.from}>`,
        to: correoDestino,
        subject: "Restablecer Contraseña - Liceo Estilita Orozco",
        text: `Hola ${usuario.username}, has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace para continuar (válido por 1 hora): ${resetLink}`,
        html: `
          <div style="background-color: #f8fafc; padding: 20px 0; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
            <table cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0;">
              <tr>
                <td style="background-color: #1a237e; padding: 30px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;">Liceo Estilita Orozco</h1>
                </td>
              </tr>
              <tr>
                <td style="padding: 40px; line-height: 1.6; color: #334155;">
                  <h2 style="color: #1a237e; margin-top: 0; font-size: 20px;">Recuperación de acceso</h2>
                  <p style="font-size: 16px;">Hola <strong>${usuario.username}</strong>,</p>
                  <p style="font-size: 16px;">Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en nuestro sistema de gestión académica.</p>
                  <p style="font-size: 16px;">Haz clic en el siguiente botón para definir una nueva contraseña. Este enlace expirará en 1 hora.</p>
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetLink}" style="background-color: #1a237e; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Restablecer Contraseña</a>
                  </div>
                  <div style="margin: 30px 0; padding: 20px; background-color: #f1f5f9; border-radius: 8px; border-left: 4px solid #1a237e;">
                    <p style="margin: 0; font-size: 14px; color: #475569;">Si no has solicitado este cambio, puedes ignorar este correo de forma segura. Tu contraseña actual no se verá afectada.</p>
                  </div>
                </td>
              </tr>
              <tr>
                <td style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
                  <p style="color: #94a3b8; font-size: 12px; margin: 0;">&copy; ${new Date().getFullYear()} Liceo Nacional Estilita Orozco. Todos los derechos reservados.</p>
                  <p style="color: #94a3b8; font-size: 12px; margin: 5px 0 0 0;">Departamento de Control de Estudios y Evaluación.</p>
                  <div style="display: none; font-size: 1px; color: #f8fafc; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
                    ID de seguridad: ${Date.now()}
                  </div>
                </td>
              </tr>
            </table>
          </div>
        `,
      });
      console.log(`[Auth] Correo de recuperación enviado exitosamente a: ${correoDestino}`);
    } catch (error) {
      console.error('[Auth] Error de Nodemailer/SMTP:', error);
      throw new AppError('Error al procesar el envío del correo electrónico.', 500);
    }

    res.json({ 
      ok: true, 
      message: 'Correo enviado con éxito.'
    });
  }),

  restablecerPassword: wrapAsync(async (req: Request, res: Response) => {
    const { token, password } = req.body;

    if (!token || !password) {
      throw new AppError('El token y la nueva contraseña son requeridos', 400);
    }

    try {
      // Verificar la validez del token y el propósito
      const decoded = jwt.verify(token, environment.jwtSecret) as any;

      if (decoded.purpose !== 'password_reset') {
        throw new AppError('Token inválido para esta operación', 400);
      }

      const usuario = await UsuarioModel.findByPk(decoded.idUsuario);
      if (!usuario) {
        throw new AppError('Usuario no encontrado', 404);
      }

      // Hashear la nueva contraseña antes de guardarla
      const salt = await bcrypt.genSalt(10);
      usuario.password_hash = await bcrypt.hash(password, salt);
      
      await usuario.save();

      res.json({ ok: true, message: 'Contraseña actualizada con éxito' });
    } catch (error: any) {
      if (error.name === 'TokenExpiredError') {
        throw new AppError('El enlace ha expirado. Por favor, solicite uno nuevo.', 400);
      }
      if (error.name === 'JsonWebTokenError') {
        throw new AppError('El enlace de recuperación es inválido.', 400);
      }
      throw error;
    }
  }),
};
