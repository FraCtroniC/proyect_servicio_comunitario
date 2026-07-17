import bcrypt from 'bcrypt';
import { Usuario as UsuarioModel, Persona, Docente, Rol, RefreshToken, sequelize } from '../models';
import { UsuarioDto, CrearUsuarioDto, ActualizarUsuarioDto } from '../types/usuario.types';
import { NotFoundError, ValidationError } from '../shared/errors';

const SALT_ROUNDS = 10;

function mapModelToDto(model: UsuarioModel): UsuarioDto {
  const persona = (model as any).persona;
  const docente = (model as any).docente;
  return {
    id: model.id_usuario,
    idRol: model.id_rol,
    idDocente: model.id_docente,
    idPersona: model.id_persona,
    username: model.username,
    estatus: model.estatus,
    ultimoAcceso: model.ultimo_acceso,
    createdAt: model.created_at,
    updatedAt: model.updated_at,
    role: model.rol ? { idRol: model.rol.id_rol, nombre: model.rol.nombre } : undefined,
    idEspecialidad: docente?.id_especialidad ?? undefined,
    persona: persona ? {
      idPersona: persona.id_persona,
      cedula: persona.cedula,
      nombre1: persona.nombre1,
      nombre2: persona.nombre2,
      apellido1: persona.apellido1,
      apellido2: persona.apellido2,
      fechaNac: persona.fecha_nac,
      correo: persona.correo,
      telefono: persona.telefono,
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
        { model: Persona, as: 'persona' },
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
        { model: Persona, as: 'persona' },
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

    const transaction = await sequelize.transaction();

    try {
      let idPersona = dto.idPersona ?? null;

      if (dto.cedula && dto.nombre1) {
        const [persona] = await Persona.findOrCreate({
          where: { cedula: dto.cedula },
          defaults: {
            cedula: dto.cedula,
            nombre1: dto.nombre1,
            nombre2: dto.nombre2 ?? null,
            apellido1: dto.apellido1 ?? '',
            apellido2: dto.apellido2 ?? null,
            fecha_nac: dto.fecha_nac ?? null,
            correo: dto.correo ?? null,
            telefono: dto.telefono ?? null,
          },
          transaction,
        });
        idPersona = persona.id_persona;
      }

      let idDocente = dto.idDocente ?? null;

      if (dto.idRol === 5 && idPersona && !idDocente) {
        const docente = await Docente.create({
          id_persona: idPersona,
          id_especialidad: dto.id_especialidad ?? null,
          estatus: 'Activo',
          created_at: new Date(),
          updated_at: new Date(),
        }, { transaction });
        idDocente = docente.id_docente;
      }

      const usuario = await UsuarioModel.create({
        id_rol: dto.idRol,
        id_docente: idDocente,
        id_persona: idPersona,
        username: dto.username,
        password_hash: passwordHash,
        estatus: dto.estatus ?? 'Activo',
      }, { transaction });

      await transaction.commit();

      const created = await UsuarioModel.findByPk(usuario.id_usuario, {
        attributes: { exclude: ['password_hash'] },
        include: [
          { model: Rol, as: 'rol' },
          { model: Persona, as: 'persona' },
          { model: Docente, as: 'docente' },
        ],
      });

      return mapModelToDto(created!);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
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
        const [cedulaResults] = await Persona.sequelize!.query(
          `SELECT id_persona FROM personas WHERE cedula = :cedula AND id_persona != :idPersona`,
          { replacements: { cedula: dto.username, idPersona: usuario.id_persona || 0 } }
        );
        if ((cedulaResults as any[]).length > 0) {
          errores.username = ['El username coincide con la cédula de otra persona'];
        } else {
          usuario.username = dto.username;
        }
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

    if (dto.idPersona !== undefined) {
      usuario.id_persona = dto.idPersona ?? null;
    }

    if (dto.estatus !== undefined) {
      usuario.estatus = dto.estatus;
    }

    if (dto.cedula !== undefined || dto.nombre1 !== undefined || dto.apellido1 !== undefined || dto.correo !== undefined || dto.telefono !== undefined) {
      if (usuario.id_persona) {
        await Persona.update(
          {
            ...(dto.cedula !== undefined && { cedula: dto.cedula }),
            ...(dto.nombre1 !== undefined && { nombre1: dto.nombre1 }),
            ...(dto.nombre2 !== undefined && { nombre2: dto.nombre2 }),
            ...(dto.apellido1 !== undefined && { apellido1: dto.apellido1 }),
            ...(dto.apellido2 !== undefined && { apellido2: dto.apellido2 }),
            ...(dto.correo !== undefined && { correo: dto.correo }),
            ...(dto.telefono !== undefined && { telefono: dto.telefono }),
          },
          { where: { id_persona: usuario.id_persona } }
        );
      } else if (dto.cedula && dto.nombre1) {
        const [persona] = await Persona.findOrCreate({
          where: { cedula: dto.cedula },
          defaults: {
            cedula: dto.cedula,
            nombre1: dto.nombre1,
            nombre2: dto.nombre2 ?? null,
            apellido1: dto.apellido1 ?? '',
            apellido2: dto.apellido2 ?? null,
            correo: dto.correo ?? null,
            telefono: dto.telefono ?? null,
          },
        });
        usuario.id_persona = persona.id_persona;
      }
    }

    await usuario.save();

    const updated = await UsuarioModel.findByPk(id, {
      attributes: { exclude: ['password_hash'] },
      include: [
        { model: Rol, as: 'rol' },
        { model: Persona, as: 'persona' },
        { model: Docente, as: 'docente' },
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
