import bcrypt from 'bcrypt';
import { Usuario as UsuarioModel, Rol } from '../models';
import { UsuarioDto, CrearUsuarioDto, ActualizarUsuarioDto } from '../types/usuario.types';
import { NotFoundError, ValidationError } from '../shared/errors';

const SALT_ROUNDS = 10;

function mapModelToDto(model: UsuarioModel): UsuarioDto {
  return {
    id: model.id_usuario,
    idRol: model.id_rol,
    idDocente: model.id_docente,
    username: model.username,
    passwordHash: model.password_hash,
    estatus: model.estatus,
    correo: model.correo,
    ultimoAcceso: model.ultimo_acceso,
    createdAt: model.created_at,
    updatedAt: model.updated_at,
    role: model.rol ? { idRol: model.rol.id_rol, nombre: model.rol.nombre } : undefined,
  };
}

export const UsuarioService = {
  async listar(): Promise<UsuarioDto[]> {
    const usuarios = await UsuarioModel.findAll({
      order: [['id_usuario', 'ASC']],
      include: [
        { model: Rol, as: 'rol' },
      ],
    });
    return usuarios.map(mapModelToDto);
  },

  async obtenerPorId(id: number): Promise<UsuarioDto> {
    const usuario = await UsuarioModel.findByPk(id);
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

    if (dto.username) {
      const existente = await UsuarioModel.findOne({ where: { username: dto.username } });
      if (existente && existente.id_usuario !== id) {
        throw new ValidationError({
          username: ['El username ya está en uso'],
        });
      }
      usuario.username = dto.username;
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

    if (dto.correo !== undefined) {
      usuario.correo = dto.correo;
    }

    if (dto.estatus !== undefined) {
      usuario.estatus = dto.estatus;
    }

    await usuario.save();
    return mapModelToDto(usuario);
  },

  async eliminar(id: number): Promise<void> {
    const deletedCount = await UsuarioModel.destroy({ where: { id_usuario: id } });
    if (deletedCount === 0) {
      throw new NotFoundError(`Usuario con id ${id} no encontrado`);
    }
  },
};
