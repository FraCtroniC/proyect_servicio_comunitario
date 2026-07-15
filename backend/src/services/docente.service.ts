import bcrypt from 'bcrypt';
import { Persona, Docente, Usuario, Especialidad, Rol, sequelize } from '../models';
import { CrearDocenteDto, DocenteConUsuarioDto } from '../types/docente.types';
import { ValidationError } from '../shared/errors';

const SALT_ROUNDS = 10;
const ROL_DOCENTE_ID = 5;
const PASSWORD_LENGTH = 5;

function limpiarCedula(cedula: string): string {
  return cedula.replace(/^[VvEe]-/, '');
}

function generarPassword(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';
  for (let i = 0; i < PASSWORD_LENGTH; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

function mapDocenteToDto(model: Docente): any {
  const persona = (model as any).persona;
  return {
    idDocente: model.id_docente,
    idPersona: model.id_persona,
    idEspecialidad: model.id_especialidad,
    tokenQr: model.token_qr,
    estatus: model.estatus,
    persona: persona ? {
      idPersona: persona.id_persona,
      cedula: persona.cedula,
      nombre1: persona.nombre1,
      nombre2: persona.nombre2,
      apellido1: persona.apellido1,
      apellido2: persona.apellido2,
      fechaNac: persona.fecha_nac,
      telefono: persona.telefono,
      correo: persona.correo,
    } : undefined,
    createdAt: model.created_at,
    updatedAt: model.updated_at,
  };
}

export const DocenteService = {
  async listar(): Promise<any[]> {
    const docentes = await Docente.findAll({
      order: [['id_docente', 'ASC']],
      include: [{ model: Persona, as: 'persona' }],
    });
    return docentes.map(mapDocenteToDto);
  },

  async obtenerPorId(id: number): Promise<any> {
    const docente = await Docente.findByPk(id, {
      include: [{ model: Persona, as: 'persona' }],
    });
    if (!docente) {
      throw new ValidationError({ docente: ['Docente no encontrado'] });
    }
    return mapDocenteToDto(docente);
  },

  async crear(dto: CrearDocenteDto): Promise<DocenteConUsuarioDto> {
    const transaction = await sequelize.transaction();
    const now = new Date();

    try {
      if (dto.fecha_nac) {
        const dob = new Date(dto.fecha_nac);
        let age = now.getFullYear() - dob.getFullYear();
        const m = now.getMonth() - dob.getMonth();
        if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) {
          age--;
        }
        if (age < 18 || age > 70) {
          throw new ValidationError({ fecha_nac: [`La edad del docente debe estar entre 18 y 70 años (actual: ${age} años)`] });
        }
      }

      const persona = await Persona.create({
        cedula: limpiarCedula(dto.cedula),
        nombre1: dto.nombre1,
        nombre2: dto.nombre2 ?? null,
        apellido1: dto.apellido1,
        apellido2: dto.apellido2 ?? null,
        fecha_nac: dto.fecha_nac ?? null,
        telefono: dto.telefono ?? null,
        correo: dto.correo ?? null,
        created_at: now,
        updated_at: now,
      }, { transaction });

      const docente = await Docente.create({
        id_persona: persona.id_persona,
        id_especialidad: dto.id_especialidad ?? null,
        estatus: 'Activo',
        created_at: now,
        updated_at: now,
      }, { transaction });

      const username = limpiarCedula(dto.cedula);
      const passwordTemporal = generarPassword();
      const passwordHash = await bcrypt.hash(passwordTemporal, SALT_ROUNDS);

      const usuario = await Usuario.create({
        id_rol: ROL_DOCENTE_ID,
        id_docente: docente.id_docente,
        id_persona: persona.id_persona,
        username,
        password_hash: passwordHash,
        estatus: 'Activo',
        created_at: now,
        updated_at: now,
      }, { transaction });

      await transaction.commit();

      const docenteConPersona = await Docente.findByPk(docente.id_docente, {
        include: [{ model: Persona, as: 'persona' }],
      });

      return {
        docente: mapDocenteToDto(docenteConPersona!),
        usuario: {
          idUsuario: usuario.id_usuario,
          username: usuario.username,
          estatus: usuario.estatus ?? 'Activo',
        },
        persona: {
          idPersona: persona.id_persona,
          cedula: persona.cedula,
          nombre1: persona.nombre1,
          nombre2: persona.nombre2,
          apellido1: persona.apellido1,
          apellido2: persona.apellido2,
          correo: persona.correo,
        },
        password_temporal: passwordTemporal,
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async actualizar(id: number, dto: Partial<CrearDocenteDto>): Promise<{ docente: any; usuario: any }> {
    const transaction = await sequelize.transaction();

    try {
      const docente = await Docente.findByPk(id, {
        include: [{ model: Persona, as: 'persona' }],
        transaction,
      });
      if (!docente) {
        throw new ValidationError({ docente: ['Docente no encontrado'] });
      }

      if (dto.fecha_nac !== undefined && dto.fecha_nac !== null) {
        const now = new Date();
        const dob = new Date(dto.fecha_nac);
        let age = now.getFullYear() - dob.getFullYear();
        const m = now.getMonth() - dob.getMonth();
        if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) {
          age--;
        }
        if (age < 18 || age > 70) {
          throw new ValidationError({ fecha_nac: [`La edad del docente debe estar entre 18 y 70 años (actual: ${age} años)`] });
        }
      }

      const persona = (docente as any).persona;
      if (persona) {
        const personaUpdate: any = {};
        if (dto.cedula !== undefined) personaUpdate.cedula = limpiarCedula(dto.cedula);
        if (dto.nombre1 !== undefined) personaUpdate.nombre1 = dto.nombre1;
        if (dto.nombre2 !== undefined) personaUpdate.nombre2 = dto.nombre2;
        if (dto.apellido1 !== undefined) personaUpdate.apellido1 = dto.apellido1;
        if (dto.apellido2 !== undefined) personaUpdate.apellido2 = dto.apellido2;
        if (dto.fecha_nac !== undefined) personaUpdate.fecha_nac = dto.fecha_nac;
        if (dto.telefono !== undefined) personaUpdate.telefono = dto.telefono;
        if (dto.correo !== undefined) personaUpdate.correo = dto.correo;
        if (Object.keys(personaUpdate).length > 0) {
          await persona.update(personaUpdate, { transaction });
        }
      }

      const updateData: any = {};
      if (dto.id_especialidad !== undefined) updateData.id_especialidad = dto.id_especialidad;
      if (Object.keys(updateData).length > 0) {
        await docente.update(updateData, { transaction });
      }

      const usuario = await Usuario.findOne({ where: { id_docente: id }, transaction });
      if (usuario) {
        const usuarioUpdate: any = {};
        if (dto.cedula !== undefined) usuarioUpdate.username = limpiarCedula(dto.cedula);
        if (Object.keys(usuarioUpdate).length > 0) {
          await usuario.update(usuarioUpdate, { transaction });
        }
      }

      await transaction.commit();

      const updatedDocente = await Docente.findByPk(id, {
        include: [{ model: Persona, as: 'persona' }],
      });
      const updatedUsuario = usuario
        ? await Usuario.findByPk(usuario.id_usuario, {
            attributes: { exclude: ['password_hash'] },
            include: [{ model: Rol, as: 'rol' }],
          })
        : null;

      return {
        docente: mapDocenteToDto(updatedDocente!),
        usuario: updatedUsuario ? {
          id: updatedUsuario.id_usuario,
          idRol: updatedUsuario.id_rol,
          idDocente: updatedUsuario.id_docente,
          username: updatedUsuario.username,
          estatus: updatedUsuario.estatus,
          createdAt: updatedUsuario.created_at,
          updatedAt: updatedUsuario.updated_at,
          role: updatedUsuario.rol ? { idRol: updatedUsuario.rol.id_rol, nombre: updatedUsuario.rol.nombre } : undefined,
        } : null,
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async eliminar(id: number): Promise<number | null> {
    const transaction = await sequelize.transaction();

    try {
      const docente = await Docente.findByPk(id, { transaction });
      if (!docente) {
        throw new ValidationError({ docente: ['Docente no encontrado'] });
      }

      const usuario = await Usuario.findOne({ where: { id_docente: id }, transaction });
      const usuarioId = usuario ? usuario.id_usuario : null;

      if (usuario) {
        await usuario.destroy({ transaction });
      }
      await docente.destroy({ transaction });

      await transaction.commit();
      return usuarioId;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
