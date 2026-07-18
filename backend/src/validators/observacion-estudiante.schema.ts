import { z } from 'zod';

const GRAVEDADES = ['Bajo', 'Moderado', 'Alto', 'Critico'] as const;

export const crearObservacionEstudianteSchema = z.object({
  texto: z.string({ message: 'El texto de la observación es requerido' })
    .min(1, 'El texto no puede estar vacío')
    .transform(val => val.trim()),
  gravedad: z.enum(GRAVEDADES, {
    message: `gravedad debe ser: ${GRAVEDADES.join(', ')}`,
  }).optional(),
  id_usuario_crea: z.number()
    .int()
    .positive()
    .nullable()
    .optional(),
});

export const actualizarObservacionEstudianteSchema = z.object({
  texto: z.string()
    .min(1, 'El texto no puede estar vacío')
    .transform(val => val.trim())
    .optional(),
  gravedad: z.enum(GRAVEDADES, {
    message: `gravedad debe ser: ${GRAVEDADES.join(', ')}`,
  }).optional(),
});
