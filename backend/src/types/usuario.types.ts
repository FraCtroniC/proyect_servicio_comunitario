export interface PersonaInfoDto {
  idPersona: number;
  cedula: string;
  nombre1: string;
  nombre2: string | null;
  apellido1: string;
  apellido2: string | null;
  fechaNac: string | null;
  correo: string | null;
  telefono: string | null;
}

export interface UsuarioDto {
  id: number;
  idRol: number;
  idDocente: number | null;
  idPersona: number | null;
  username: string;
  estatus: string | null;
  ultimoAcceso: Date | null;
  createdAt: Date;
  updatedAt: Date | null;
  role?: { idRol: number; nombre: string };
  persona?: PersonaInfoDto;
  idEspecialidad?: number;
}

export interface CrearUsuarioDto {
  idRol: number;
  idDocente?: number;
  idPersona?: number;
  username: string;
  password: string;
  estatus?: string;
  cedula?: string;
  nombre1?: string;
  nombre2?: string;
  apellido1?: string;
  apellido2?: string;
  correo?: string;
  telefono?: string;
  fecha_nac?: string;
  id_especialidad?: number;
}

export interface ActualizarUsuarioDto {
  idRol?: number;
  idDocente?: number;
  idPersona?: number;
  username?: string;
  password?: string;
  estatus?: string;
  cedula?: string;
  nombre1?: string;
  nombre2?: string;
  apellido1?: string;
  apellido2?: string;
  correo?: string;
  telefono?: string;
  fecha_nac?: string;
  id_especialidad?: number;
}
