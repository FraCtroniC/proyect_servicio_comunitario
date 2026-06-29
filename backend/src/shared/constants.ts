export const ROLES = {
  SUPER_ADMIN: 1,
  CONTROL_ESTUDIOS: 2,
  DOCENTE: 3,
} as const;

export const ASISTENCIA_ESTUDIANTE_STATUS = ['Presente', 'Ausente', 'Justificado'] as const;
export const ASISTENCIA_DOCENTE_STATUS = ['Puntual', 'Retardo', 'Ausente', 'Justificado'] as const;

export const HORA_LIMITE_PUNTUAL = '07:05';
