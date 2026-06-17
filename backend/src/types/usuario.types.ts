export interface UsuarioDto {
  id: number;
  idRol: number;
  idDocente: number | null;
  username: string;
  passwordHash: string;
  estatus: string | null;
  ultimoAcceso: Date | null;
  createdAt: Date;
  updatedAt: Date | null;
}

export interface CrearUsuarioDto {
  idRol: number;
  idDocente?: number;
  username: string;
  password: string;
  estatus?: string;
}

export interface ActualizarUsuarioDto {
  idRol?: number;
  idDocente?: number;
  username?: string;
  password?: string;
  estatus?: string;
}
