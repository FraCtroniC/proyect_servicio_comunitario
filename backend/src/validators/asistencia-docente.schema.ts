import { z } from 'zod';
import { ASISTENCIA_DOCENTE_STATUS, HORA_LIMITE_PUNTUAL } from '../shared/constants';

const isValidDateStr = (val: string) => /^\d{4}-\d{2}-\d{2}$/.test(val) && !isNaN(new Date(val).getTime());
const isNotFuture = (val: string) => {
  const d = new Date();
  const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  return val <= today;
};

const timeRegex = /^\d{2}:\d{2}$/;

const isValidTime = (val: string) => timeRegex.test(val);

export const crearAsistenciaDocenteSchema = z.object({
  id_docente: z.number({ message: 'id_docente debe ser un número' })
    .int('id_docente debe ser un entero')
    .positive('id_docente debe ser positivo'),
  fecha: z.string({ message: 'fecha es requerida' })
    .refine(isValidDateStr, 'fecha no es una fecha válida')
    .refine(isNotFuture, 'No se puede registrar asistencia en una fecha futura'),
  hora_entrada: z.string()
    .refine(isValidTime, 'hora_entrada debe tener formato HH:MM')
    .optional(),
  hora_salida: z.string()
    .refine(isValidTime, 'hora_salida debe tener formato HH:MM')
    .optional(),
  estatus: z.enum(ASISTENCIA_DOCENTE_STATUS as unknown as [string, ...string[]], {
    message: `estatus debe ser: ${ASISTENCIA_DOCENTE_STATUS.join(', ')}`,
  }).optional(),
}).refine(data => {
  if (!data.estatus && data.hora_entrada) {
    const [h, m] = data.hora_entrada.split(':').map(Number);
    const [hl, ml] = HORA_LIMITE_PUNTUAL.split(':').map(Number);
    const entradaMin = h * 60 + m;
    const limiteMin = hl * 60 + ml;
    data.estatus = entradaMin <= limiteMin ? 'Puntual' : 'Retardo';
  }
  return true;
}, { message: 'Error al determinar estatus automático' });

export const actualizarAsistenciaDocenteSchema = z.object({
  hora_entrada: z.string()
    .refine(isValidTime, 'hora_entrada debe tener formato HH:MM')
    .optional(),
  hora_salida: z.string()
    .refine(isValidTime, 'hora_salida debe tener formato HH:MM')
    .optional(),
  estatus: z.enum(ASISTENCIA_DOCENTE_STATUS as unknown as [string, ...string[]], {
    message: `estatus debe ser: ${ASISTENCIA_DOCENTE_STATUS.join(', ')}`,
  }).optional(),
}).refine(data => {
  if (data.hora_salida && data.hora_entrada) {
    const [h1, m1] = data.hora_entrada.split(':').map(Number);
    const [h2, m2] = data.hora_salida.split(':').map(Number);
    const entradaMin = h1 * 60 + m1;
    const salidaMin = h2 * 60 + m2;
    return salidaMin > entradaMin;
  }
  return true;
}, { message: 'La hora de salida debe ser posterior a la hora de entrada' });
