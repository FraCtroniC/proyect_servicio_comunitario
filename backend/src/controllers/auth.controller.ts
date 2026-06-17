import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Usuario as UsuarioModel, Rol, Docente } from '../models';
import { environment } from '../../config/environment';
import { AppError } from '../shared/errors';
import { wrapAsync } from '../shared/utils/wrapAsync';

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
};
