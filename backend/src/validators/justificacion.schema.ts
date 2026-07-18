import { z } from 'zod';

export const crearJustificacionSchema = z.object({
  id_asistencia: z.number({ message: 'id_asistencia es requerido' })
    .int()
    .positive('id_asistencia debe ser positivo'),
  motivo: z.string({ message: 'El motivo de la justificación es requerido' })
    .min(1, 'El motivo no puede estar vacío')
    .transform(val => val.trim()),
  soporte_digital: z.string()
    .max(255, 'soporte_digital debe tener máximo 255 caracteres')
    .transform(val => val?.trim() || null)
    .nullable()
    .optional(),
});

export const actualizarJustificacionSchema = z.object({
  motivo: z.string()
    .min(1, 'El motivo no puede estar vacío')
    .transform(val => val.trim())
    .optional(),
  soporte_digital: z.string()
    .max(255, 'soporte_digital debe tener máximo 255 caracteres')
    .transform(val => val?.trim() || null)
    .nullable()
    .optional(),
});

export const crearJustificacionEstudianteSchema = z.object({
  id_asistencia_est: z.number()
    .int()
    .positive()
    .optional(),
  id_estudiante: z.number()
    .int()
    .positive()
    .optional(),
  fecha: z.string()
    .optional(),
  id_horario: z.number()
    .int()
    .positive()
    .nullable()
    .optional(),
  motivo: z.string({ message: 'El motivo de la justificación es requerido' })
    .min(1, 'El motivo no puede estar vacío')
    .transform(val => val.trim()),
  soporte_digital: z.string()
    .max(255, 'soporte_digital debe tener máximo 255 caracteres')
    .transform(val => val?.trim() || null)
    .nullable()
    .optional(),
}).refine(
  (data) => data.id_asistencia_est || (data.id_estudiante && data.fecha),
  { message: 'Se requiere id_asistencia_est o (id_estudiante y fecha)' }
);
