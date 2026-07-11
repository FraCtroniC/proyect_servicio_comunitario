export interface DocenteDto {
  idDocente: number;
  cedulaDocente: string;
  nombre1: string;
  nombre2: string | null;
  apellido1: string;
  apellido2: string | null;
  idEspecialidad: number | null;
  fechaNac: string | null;
  telefono: string | null;
  correo: string | null;
  tokenQr: string | null;
  estatus: string | null;
  createdAt: Date;
  updatedAt: Date | null;
}

export interface CrearDocenteDto {
  cedula_docente: string;
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
    correo: string | null;
    estatus: string;
  };
  password_temporal: string;
}
