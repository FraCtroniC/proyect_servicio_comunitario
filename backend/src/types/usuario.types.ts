export interface UsuarioDto {
  id: number;
  idRol: number;
  username: string;
  estatus: string | null;
  ultimoAcceso: Date | null;
  createdAt: Date;
  updatedAt: Date | null;
  role?: { idRol: number; nombre: string };
  cedula: string | null;
  nombre1: string | null;
  nombre2: string | null;
  apellido1: string | null;
  apellido2: string | null;
  fechaNac: string | null;
  correo: string | null;
  telefono: string | null;
  idEspecialidad: number | null;
  especialidad?: { idEspecialidad: number; nombre: string } | null;
  tokenQr: string | null;
  estatusDocente: string | null;
}

export interface CrearUsuarioDto {
  idRol: number;
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
