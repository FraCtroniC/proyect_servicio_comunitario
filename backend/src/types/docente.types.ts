export interface DocenteDto {
  idDocente: number;
  idPersona: number | null;
  idEspecialidad: number | null;
  tokenQr: string | null;
  estatus: string | null;
  persona?: {
    idPersona: number;
    cedula: string;
    nombre1: string;
    nombre2: string | null;
    apellido1: string;
    apellido2: string | null;
    fechaNac: string | null;
    telefono: string | null;
    correo: string | null;
  };
  createdAt: Date;
  updatedAt: Date | null;
}

export interface CrearDocenteDto {
  cedula: string;
  nombre1: string;
  nombre2?: string;
  apellido1: string;
  apellido2?: string;
  id_especialidad?: number;
  fecha_nac?: string;
  telefono?: string;
  correo?: string;
}

export interface DocenteConUsuarioDto {
  docente: DocenteDto;
  usuario: {
    idUsuario: number;
    username: string;
    estatus: string;
  };
  persona: {
    idPersona: number;
    cedula: string;
    nombre1: string;
    nombre2: string | null;
    apellido1: string;
    apellido2: string | null;
    correo: string | null;
  };
  password_temporal: string;
}
