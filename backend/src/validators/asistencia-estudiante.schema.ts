import { z } from 'zod';
import { ASISTENCIA_ESTUDIANTE_STATUS } from '../shared/constants';

const isValidDateStr = (val: string) => /^\d{4}-\d{2}-\d{2}$/.test(val) && !isNaN(new Date(val).getTime());
const isNotFuture = (val: string) => {
  const d = new Date();
  const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  return val <= today;
};

export const crearAsistenciaEstudianteSchema = z.object({
  id_matricula: z.number({ message: 'id_matricula debe ser un número' })
    .int('id_matricula debe ser un entero')
    .positive('id_matricula debe ser positivo'),
  fecha: z.string({ message: 'fecha es requerida' })
    .refine(isValidDateStr, 'fecha no es una fecha válida')
    .refine(isNotFuture, 'No se puede registrar asistencia en una fecha futura'),
  id_horario: z.number()
    .int('id_horario debe ser un entero')
    .positive('id_horario debe ser positivo')
    .nullable()
    .optional(),
  id_docente_toma: z.number()
    .int('id_docente_toma debe ser un entero')
    .positive('id_docente_toma debe ser positivo')
    .nullable()
    .optional(),
  estatus: z.enum(ASISTENCIA_ESTUDIANTE_STATUS as unknown as [string, ...string[]], {
    message: `estatus debe ser: ${ASISTENCIA_ESTUDIANTE_STATUS.join(', ')}`,
  }).optional(),
  observacion: z.object({
    texto: z.string().min(1, 'El texto de la observación es requerido').transform(val => val.trim()),
    gravedad: z.enum(['Bajo', 'Moderado', 'Alto', 'Critico']).optional(),
  }).nullable().optional(),
});

export const crearBatchAsistenciaEstudianteSchema = z.object({
  registros: z.array(z.object({
    id_matricula: z.number({ message: 'id_matricula debe ser un número' })
      .int().positive(),
    fecha: z.string({ message: 'fecha es requerida' })
      .refine(isValidDateStr, 'fecha no es una fecha válida')
      .refine(isNotFuture, 'No se puede registrar asistencia en una fecha futura'),
    id_horario: z.number()
      .int().positive()
      .nullable()
      .optional(),
    estatus: z.enum(ASISTENCIA_ESTUDIANTE_STATUS as unknown as [string, ...string[]])
      .optional(),
    observacion: z.object({
      texto: z.string().min(1).transform(val => val.trim()),
      gravedad: z.enum(['Bajo', 'Moderado', 'Alto', 'Critico']).optional(),
    }).nullable().optional(),
  })).nonempty('registros debe ser un array no vacío'),
});

export const actualizarAsistenciaEstudianteSchema = z.object({
  estatus: z.enum(ASISTENCIA_ESTUDIANTE_STATUS as unknown as [string, ...string[]], {
    message: `estatus debe ser: ${ASISTENCIA_ESTUDIANTE_STATUS.join(', ')}`,
  }).optional(),
  id_observacion: z.number()
    .int()
    .positive()
    .nullable()
    .optional(),
  observacion: z.object({
    texto: z.string().min(1, 'El texto de la observación es requerido').transform(val => val.trim()),
    gravedad: z.enum(['Bajo', 'Moderado', 'Alto', 'Critico']).optional(),
  }).nullable().optional(),
});

export const syncInasistenciasSchema = z.object({
  id_matricula: z.number({ message: 'id_matricula es requerido' }).int().positive(),
  id_periodo: z.number().int().positive().optional(),
});

export const syncInasistenciasBatchSchema = z.object({
  ids_matricula: z.array(z.number().int().positive())
    .nonempty('ids_matricula debe ser un array no vacío'),
  id_periodo: z.number().int().positive().optional(),
});
