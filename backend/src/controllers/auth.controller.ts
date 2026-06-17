import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { Op } from 'sequelize';
import { Usuario as UsuarioModel, Rol, Docente } from '../models';
import { environment } from '../../config/environment';
import { AppError } from '../shared/errors';
import { wrapAsync } from '../shared/utils/wrapAsync';

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

    // Buscar el usuario en la base de datos e incluir Rol y Docente
    const usuario = await UsuarioModel.findOne({
      where: { username: username.toLowerCase() },
      include: [
        { model: Rol, as: 'rol' },
        { model: Docente, as: 'docente' }
      ]
    });

    if (!usuario) {
      throw new AppError('Usuario o contraseña incorrectos', 401);
    }

    if (usuario.estatus !== 'Activo') {
      throw new AppError('Esta cuenta está inactiva o bloqueada. Comuníquese con el administrador.', 403);
    }

    // Verificar contraseña
    const passwordMatch = await bcrypt.compare(password, usuario.password_hash);
    if (!passwordMatch) {
      throw new AppError('Usuario o contraseña incorrectos', 401);
    }

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
      { expiresIn: '8h' }
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
      // Por seguridad, devolvemos un mensaje genérico para evitar que atacantes adivinen correos
      res.json({ ok: true, message: 'Si el correo electrónico está registrado, se enviarán instrucciones.' });
      return;
    }

    // Determinamos el destinatario (priorizamos el de la tabla usuarios, luego el del docente vinculado)
    const correoDestino = usuario.correo || (usuario.docente ? (usuario.docente as any).correo : null);

    if (!correoDestino) {
      console.log(`[Auth] Usuario ${usuario.username} encontrado pero no tiene un correo válido definido.`);
      res.json({ ok: true, message: 'Si el correo electrónico está registrado, se enviarán instrucciones.' });
      return;
    }

    try {
      await transporter.sendMail({
        from: `"Soporte Liceo" <${environment.smtp.from}>`,
        to: correoDestino,
        subject: "Restablecer Contraseña - Liceo Estilita Orozco",
        text: `Hola ${usuario.username}, has solicitado restablecer tu contraseña.`,
        html: `
          <div style="background-color: #f8fafc; padding: 40px 20px; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0;">
              <div style="background-color: #1a237e; padding: 30px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;">Liceo Estilita Orozco</h1>
              </div>
              <div style="padding: 40px; line-height: 1.6; color: #334155;">
                <h2 style="color: #1a237e; margin-top: 0; font-size: 20px;">Recuperación de acceso</h2>
                <p style="font-size: 16px;">Hola <strong>${usuario.username}</strong>,</p>
                <p style="font-size: 16px;">Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en nuestro sistema de gestión académica.</p>
                <p style="font-size: 16px;">Para continuar con el proceso, pronto recibirás un código de verificación que deberás ingresar en la plataforma.</p>
                <div style="margin: 30px 0; padding: 20px; background-color: #f1f5f9; border-radius: 8px; border-left: 4px solid #1a237e;">
                  <p style="margin: 0; font-size: 14px; color: #475569;">Si no has solicitado este cambio, puedes ignorar este correo de forma segura. Tu contraseña actual no se verá afectada.</p>
                </div>
              </div>
              <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
                <p style="color: #94a3b8; font-size: 12px; margin: 0;">&copy; ${new Date().getFullYear()} Liceo Nacional Estilita Orozco. Todos los derechos reservados.</p>
                <p style="color: #94a3b8; font-size: 12px; margin: 5px 0 0 0;">Departamento de Control de Estudios y Evaluación.</p>
              </div>
            </div>
          </div>
        `,
      });
      console.log(`[Auth] Correo de recuperación enviado exitosamente a: ${correoDestino}`);
    } catch (error) {
      console.error('[Auth] Error de Nodemailer/SMTP:', error);
      throw new AppError('Error al procesar el envío del correo electrónico.', 500);
    }

    res.json({ ok: true, message: 'Correo enviado con éxito' });
  }),
};
