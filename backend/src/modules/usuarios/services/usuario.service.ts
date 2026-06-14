import { UsuarioRepository } from '../repositories';
import { CrearUsuarioDto, ActualizarUsuarioDto, Usuario } from '../types';
import { NotFoundError, ValidationError } from '../../../shared/errors';

export const UsuarioService = {
  async listar(): Promise<Usuario[]> {
    return UsuarioRepository.findAll();
  },

  async obtenerPorId(id: string): Promise<Usuario> {
    const usuario = await UsuarioRepository.findById(id);
    if (!usuario) {
      throw new NotFoundError(`Usuario con id ${id} no encontrado`);
    }
    return usuario;
  },

  async crear(dto: CrearUsuarioDto): Promise<Usuario> {
    if (!dto.nombre || !dto.email || !dto.password) {
      throw new ValidationError({
        nombre: dto.nombre ? [] : ['El nombre es requerido'],
        email: dto.email ? [] : ['El email es requerido'],
        password: dto.password ? [] : ['La contraseña es requerida'],
      });
    }
    return UsuarioRepository.create(dto);
  },

  async actualizar(id: string, dto: ActualizarUsuarioDto): Promise<Usuario> {
    await this.obtenerPorId(id);
    const usuario = await UsuarioRepository.update(id, dto);
    return usuario!;
  },

  async eliminar(id: string): Promise<void> {
    const eliminado = await UsuarioRepository.delete(id);
    if (!eliminado) {
      throw new NotFoundError(`Usuario con id ${id} no encontrado`);
    }
  },
};
