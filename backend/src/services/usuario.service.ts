import bcrypt from 'bcrypt';
import { Usuario as UsuarioModel, Rol, RefreshToken, sequelize, Especialidad } from '../models';
import { UsuarioDto, CrearUsuarioDto, ActualizarUsuarioDto } from '../types/usuario.types';
import { NotFoundError, ValidationError } from '../shared/errors';

const SALT_ROUNDS = 10;

function mapModelToDto(model: UsuarioModel): UsuarioDto {
  const especialidad = (model as any).especialidad_rel;
  return {
    id: model.id_usuario,
    idRol: model.id_rol,
    username: model.username,
    estatus: model.estatus,
    ultimoAcceso: model.ultimo_acceso,
    createdAt: model.created_at,
    updatedAt: model.updated_at,
    role: model.rol ? { idRol: model.rol.id_rol, nombre: model.rol.nombre } : undefined,
    cedula: model.cedula,
    nombre1: model.nombre1,
    nombre2: model.nombre2,
    apellido1: model.apellido1,
    apellido2: model.apellido2,
    fechaNac: model.fecha_nac,
    correo: model.correo,
    telefono: model.telefono,
    idEspecialidad: model.id_especialidad,
    especialidad: especialidad ? { idEspecialidad: especialidad.id_especialidad, nombre: especialidad.nombre } : null,
    tokenQr: model.token_qr,
    estatusDocente: model.estatus_docente,
  };
}

export const UsuarioService = {
  async listar(): Promise<UsuarioDto[]> {
    const usuarios = await UsuarioModel.findAll({
      attributes: { exclude: ['password_hash'] },
      order: [['id_usuario', 'ASC']],
      include: [
        { model: Rol, as: 'rol' },
        { model: Especialidad, as: 'especialidad_rel' },
      ],
    });
    return usuarios.map(mapModelToDto);
  },

  async obtenerPorId(id: number): Promise<UsuarioDto> {
    const usuario = await UsuarioModel.findByPk(id, {
      attributes: { exclude: ['password_hash'] },
      include: [
        { model: Rol, as: 'rol' },
        { model: Especialidad, as: 'especialidad_rel' },
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
      username: dto.username,
      password_hash: passwordHash,
      estatus: dto.estatus ?? 'Activo',
      cedula: dto.cedula ?? null,
      nombre1: dto.nombre1 ?? null,
      nombre2: dto.nombre2 ?? null,
      apellido1: dto.apellido1 ?? null,
      apellido2: dto.apellido2 ?? null,
      correo: dto.correo ?? null,
      telefono: dto.telefono ?? null,
      fecha_nac: dto.fecha_nac ?? null,
      id_especialidad: dto.id_especialidad ?? null,
    });

    const created = await UsuarioModel.findByPk(usuario.id_usuario, {
      attributes: { exclude: ['password_hash'] },
      include: [
        { model: Rol, as: 'rol' },
        { model: Especialidad, as: 'especialidad_rel' },
      ],
    });

    return mapModelToDto(created!);
  },

  async actualizar(id: number, dto: ActualizarUsuarioDto): Promise<UsuarioDto> {
    const usuario = await UsuarioModel.findByPk(id);
    if (!usuario) {
      throw new NotFoundError(`Usuario con id ${id} no encontrado`);
    }

    if (dto.username) {
      const existente = await UsuarioModel.findOne({ where: { username: dto.username } });
      if (existente && existente.id_usuario !== id) {
        throw new ValidationError({ username: ['El username ya está en uso'] });
      }
      usuario.username = dto.username;
    }

    if (dto.password) {
      usuario.password_hash = await bcrypt.hash(dto.password, SALT_ROUNDS);
    }

    if (dto.idRol !== undefined) usuario.id_rol = dto.idRol;
    if (dto.estatus !== undefined) usuario.estatus = dto.estatus;
    if (dto.cedula !== undefined) usuario.cedula = dto.cedula ?? null;
    if (dto.nombre1 !== undefined) usuario.nombre1 = dto.nombre1 ?? null;
    if (dto.nombre2 !== undefined) usuario.nombre2 = dto.nombre2 ?? null;
    if (dto.apellido1 !== undefined) usuario.apellido1 = dto.apellido1 ?? null;
    if (dto.apellido2 !== undefined) usuario.apellido2 = dto.apellido2 ?? null;
    if (dto.correo !== undefined) usuario.correo = dto.correo ?? null;
    if (dto.telefono !== undefined) usuario.telefono = dto.telefono ?? null;
    if (dto.fecha_nac !== undefined) usuario.fecha_nac = dto.fecha_nac ?? null;
    if (dto.id_especialidad !== undefined) usuario.id_especialidad = dto.id_especialidad ?? null;

    await usuario.save();

    const updated = await UsuarioModel.findByPk(id, {
      attributes: { exclude: ['password_hash'] },
      include: [
        { model: Rol, as: 'rol' },
        { model: Especialidad, as: 'especialidad_rel' },
      ],
    });
    return mapModelToDto(updated!);
  },

  async eliminar(id: number): Promise<void> {
    const transaction = await sequelize.transaction();
    try {
      await RefreshToken.destroy({ where: { id_usuario: id }, transaction });
      const deletedCount = await UsuarioModel.destroy({ where: { id_usuario: id }, transaction });
      if (deletedCount === 0) {
        throw new NotFoundError(`Usuario con id ${id} no encontrado`);
      }
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
