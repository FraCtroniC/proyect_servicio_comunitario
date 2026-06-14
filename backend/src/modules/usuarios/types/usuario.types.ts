export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: 'admin' | 'voluntario' | 'beneficiario';
  activo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CrearUsuarioDto {
  nombre: string;
  email: string;
  password: string;
  rol: Usuario['rol'];
}

export interface ActualizarUsuarioDto {
  nombre?: string;
  email?: string;
  rol?: Usuario['rol'];
  activo?: boolean;
}
