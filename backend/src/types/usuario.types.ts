export interface DocenteInfoDto {
  cedula_docente: string;
  nombre1: string;
  nombre2: string | null;
  apellido1: string;
  apellido2: string | null;
  telefono: string | null;
  correo: string | null;
}

export interface UsuarioDto {
  id: number;
  idRol: number;
  idDocente: number | null;
  username: string;
  estatus: string | null;
  correo: string | null;
  ultimoAcceso: Date | null;
  createdAt: Date;
  updatedAt: Date | null;
  role?: { idRol: number; nombre: string };
  docente?: DocenteInfoDto;
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
  telefono?: string;
}
