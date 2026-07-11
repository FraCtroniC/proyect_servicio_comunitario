import bcrypt from 'bcrypt';
import { Usuario as UsuarioModel, Rol, Docente } from '../models';
import { UsuarioDto, CrearUsuarioDto, ActualizarUsuarioDto } from '../types/usuario.types';
import { NotFoundError, ValidationError } from '../shared/errors';

const SALT_ROUNDS = 10;

function mapModelToDto(model: UsuarioModel): UsuarioDto {
  const docente = (model as any).docente;
  return {
    id: model.id_usuario,
    idRol: model.id_rol,
    idDocente: model.id_docente,
    username: model.username,
    estatus: model.estatus,
    correo: model.correo,
    ultimoAcceso: model.ultimo_acceso,
    createdAt: model.created_at,
    updatedAt: model.updated_at,
    role: model.rol ? { idRol: model.rol.id_rol, nombre: model.rol.nombre } : undefined,
    docente: docente ? {
      cedula_docente: docente.cedula_docente,
      nombre1: docente.nombre1,
      nombre2: docente.nombre2,
      apellido1: docente.apellido1,
      apellido2: docente.apellido2,
      telefono: docente.telefono,
      correo: docente.correo,
    } : undefined,
  };
}

export const UsuarioService = {
  async listar(): Promise<UsuarioDto[]> {
    const usuarios = await UsuarioModel.findAll({
      attributes: { exclude: ['password_hash'] },
      order: [['id_usuario', 'ASC']],
      include: [
        { model: Rol, as: 'rol' },
        { model: Docente, as: 'docente' },
      ],
    });
    return usuarios.map(mapModelToDto);
  },

  async obtenerPorId(id: number): Promise<UsuarioDto> {
    const usuario = await UsuarioModel.findByPk(id, {
      attributes: { exclude: ['password_hash'] },
      include: [
        { model: Rol, as: 'rol' },
        { model: Docente, as: 'docente' },
      ],
    });
    if (!usuario) {
      throw new NotFoundError(`Usuario con id ${id} no encontrado`);
    }
    return mapModelToDto(usuario);
  },

  async crear(dto: CrearUsuarioDto): Promise<UsuarioDto> {
    if (!dto.username || !dto.password || !dto.idRol) {
      throw new ValidationError({
        username: dto.username ? [] : ['El username es requerido'],
        password: dto.password ? [] : ['La contraseña es requerida'],
        idRol: dto.idRol ? [] : ['El idRol es requerido'],
      });
    }

    const existente = await UsuarioModel.findOne({ where: { username: dto.username } });
    if (existente) {
      throw new ValidationError({
        username: ['El username ya está en uso'],
      });
    }

    const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);

    const usuario = await UsuarioModel.create({
      id_rol: dto.idRol,
      id_docente: dto.idDocente ?? null,
      username: dto.username,
      password_hash: passwordHash,
      correo: dto.correo ?? null,
      estatus: dto.estatus ?? 'Activo',
    });

    return mapModelToDto(usuario);
  },

  async actualizar(id: number, dto: ActualizarUsuarioDto): Promise<UsuarioDto> {
    const usuario = await UsuarioModel.findByPk(id);
    if (!usuario) {
      throw new NotFoundError(`Usuario con id ${id} no encontrado`);
    }

    const errores: Record<string, string[]> = {};

    if (dto.username) {
      const existente = await UsuarioModel.findOne({ where: { username: dto.username } });
      if (existente && existente.id_usuario !== id) {
        errores.username = ['El username ya está en uso'];
      } else {
        const [cedulaResults] = await Docente.sequelize!.query(
          `SELECT id_docente FROM docentes WHERE cedula_docente = :cedula AND id_docente != :idDocente`,
          { replacements: { cedula: dto.username, idDocente: usuario.id_docente || 0 } }
        );
        if ((cedulaResults as any[]).length > 0) {
          errores.username = ['El username coincide con la cédula de otro docente'];
        } else {
          usuario.username = dto.username;
        }
      }
    }

    if (dto.correo) {
      const existente = await UsuarioModel.findOne({ where: { correo: dto.correo } });
      if (existente && existente.id_usuario !== id) {
        errores.correo = ['El correo ya está registrado'];
      } else {
        usuario.correo = dto.correo;
      }
    }

    if (dto.telefono && usuario.id_docente) {
      const [results] = await Docente.sequelize!.query(
        `SELECT id_docente FROM docentes WHERE telefono = :telefono AND id_docente != :idDocente`,
        { replacements: { telefono: dto.telefono, idDocente: usuario.id_docente } }
      );
      if ((results as any[]).length > 0) {
        errores.telefono = ['El teléfono ya está registrado'];
      }
    }

    if (Object.keys(errores).length > 0) {
      throw new ValidationError(errores);
    }

    if (dto.password) {
      usuario.password_hash = await bcrypt.hash(dto.password, SALT_ROUNDS);
    }

    if (dto.idRol !== undefined) {
      usuario.id_rol = dto.idRol;
    }

    if (dto.idDocente !== undefined) {
      usuario.id_docente = dto.idDocente ?? null;
    }

    if (dto.estatus !== undefined) {
      usuario.estatus = dto.estatus;
    }

    await usuario.save();

    if (dto.telefono && usuario.id_docente) {
      const docente = await Docente.findByPk(usuario.id_docente);
      if (docente) {
        (docente as any).telefono = dto.telefono;
        await docente.save();
      }
    }

    const updated = await UsuarioModel.findByPk(id, {
      attributes: { exclude: ['password_hash'] },
      include: [
        { model: Rol, as: 'rol' },
        { model: Docente, as: 'docente' },
      ],
    });
    return mapModelToDto(updated!);
  },

  async eliminar(id: number): Promise<void> {
    const deletedCount = await UsuarioModel.destroy({ where: { id_usuario: id } });
    if (deletedCount === 0) {
      throw new NotFoundError(`Usuario con id ${id} no encontrado`);
    }
  },
};
