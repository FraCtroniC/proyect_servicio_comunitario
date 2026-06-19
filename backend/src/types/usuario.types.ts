export interface UsuarioDto {
  id: number;
  idRol: number;
  idDocente: number | null;
  username: string;
  passwordHash: string;
  estatus: string | null;
  correo: string | null;
  ultimoAcceso: Date | null;
  createdAt: Date;
  updatedAt: Date | null;
  role?: { idRol: number; nombre: string };
}

export interface CrearUsuarioDto {
  idRol: number;
  idDocente?: number;
  username: string;
  password: string;
  estatus?: string;
  correo?: string;
}

export interface ActualizarUsuarioDto {
  idRol?: number;
  idDocente?: number;
  username?: string;
  password?: string;
  estatus?: string;
  correo?: string;
}
