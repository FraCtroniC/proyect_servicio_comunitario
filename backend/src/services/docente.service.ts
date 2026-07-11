import bcrypt from 'bcrypt';
import { Docente, Usuario, Rol, sequelize } from '../models';
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
  return {
    idDocente: model.id_docente,
    cedulaDocente: model.cedula_docente,
    nombre1: model.nombre1,
    nombre2: model.nombre2,
    apellido1: model.apellido1,
    apellido2: model.apellido2,
    idEspecialidad: model.id_especialidad,
    fechaNac: model.fecha_nac,
    telefono: model.telefono,
    correo: model.correo,
    tokenQr: model.token_qr,
    estatus: model.estatus,
    createdAt: model.created_at,
    updatedAt: model.updated_at,
  };
}

export const DocenteService = {
  async listar(): Promise<any[]> {
    const docentes = await Docente.findAll({
      order: [['id_docente', 'ASC']],
    });
    return docentes.map(mapDocenteToDto);
  },

  async obtenerPorId(id: number): Promise<any> {
    const docente = await Docente.findByPk(id);
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

      const docente = await Docente.create({
        cedula_docente: limpiarCedula(dto.cedula_docente),
        nombre1: dto.nombre1,
        nombre2: dto.nombre2 ?? null,
        apellido1: dto.apellido1,
        apellido2: dto.apellido2 ?? null,
        id_especialidad: dto.id_especialidad ?? null,
        fecha_nac: dto.fecha_nac ?? null,
        telefono: dto.telefono ?? null,
        correo: dto.correo ?? null,
        estatus: 'Activo',
        created_at: now,
        updated_at: now,
      }, { transaction });

      const username = limpiarCedula(dto.cedula_docente);
      const passwordTemporal = generarPassword();
      const passwordHash = await bcrypt.hash(passwordTemporal, SALT_ROUNDS);

      const usuario = await Usuario.create({
        id_rol: ROL_DOCENTE_ID,
        id_docente: docente.id_docente,
        username,
        password_hash: passwordHash,
        estatus: 'Activo',
        correo: dto.correo ?? null,
        created_at: now,
        updated_at: now,
      }, { transaction });

      await transaction.commit();

      return {
        docente: mapDocenteToDto(docente),
        usuario: {
          idUsuario: usuario.id_usuario,
          username: usuario.username,
          correo: usuario.correo,
          estatus: usuario.estatus ?? 'Activo',
        },
        password_temporal: passwordTemporal,
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async actualizar(id: number, dto: Partial<CrearDocenteDto>): Promise<any> {
    const docente = await Docente.findByPk(id);
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

    const updateData: any = {};
    if (dto.cedula_docente !== undefined) updateData.cedula_docente = dto.cedula_docente;
    if (dto.nombre1 !== undefined) updateData.nombre1 = dto.nombre1;
    if (dto.nombre2 !== undefined) updateData.nombre2 = dto.nombre2;
    if (dto.apellido1 !== undefined) updateData.apellido1 = dto.apellido1;
    if (dto.apellido2 !== undefined) updateData.apellido2 = dto.apellido2;
    if (dto.id_especialidad !== undefined) updateData.id_especialidad = dto.id_especialidad;
    if (dto.fecha_nac !== undefined) updateData.fecha_nac = dto.fecha_nac;
    if (dto.telefono !== undefined) updateData.telefono = dto.telefono;
    if (dto.correo !== undefined) updateData.correo = dto.correo;

    await docente.update(updateData);
    return mapDocenteToDto(docente);
  },

  async eliminar(id: number): Promise<void> {
    const docente = await Docente.findByPk(id);
    if (!docente) {
      throw new ValidationError({ docente: ['Docente no encontrado'] });
    }
    await docente.destroy();
  },
};
