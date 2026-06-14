import { Usuario, CrearUsuarioDto, ActualizarUsuarioDto } from '../types';

const usuarios: Usuario[] = [];

export const UsuarioRepository = {
  async findAll(): Promise<Usuario[]> {
    return usuarios;
  },

  async findById(id: string): Promise<Usuario | null> {
    return usuarios.find((u) => u.id === id) ?? null;
  },

  async create(dto: CrearUsuarioDto): Promise<Usuario> {
    const usuario: Usuario = {
      id: String(usuarios.length + 1),
      nombre: dto.nombre,
      email: dto.email,
      rol: dto.rol,
      activo: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    usuarios.push(usuario);
    return usuario;
  },

  async update(id: string, dto: ActualizarUsuarioDto): Promise<Usuario | null> {
    const index = usuarios.findIndex((u) => u.id === id);
    if (index === -1) return null;

    usuarios[index] = {
      ...usuarios[index],
      ...dto,
      updatedAt: new Date(),
    };
    return usuarios[index];
  },

  async delete(id: string): Promise<boolean> {
    const index = usuarios.findIndex((u) => u.id === id);
    if (index === -1) return false;

    usuarios.splice(index, 1);
    return true;
  },
};
