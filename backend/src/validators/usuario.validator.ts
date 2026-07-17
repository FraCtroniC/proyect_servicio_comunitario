import { z } from 'zod';
import { validateZod } from './zod.middleware';

const CEDULA_REGEX = /^[VE]-\d{4,8}$/;
const NAME_REGEX = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
const PHONE_REGEX = /^\d{4}-\d{7}$/;

const crearUsuarioSchema = z.object({
  username: z.string()
    .min(1, 'El username es requerido')
    .max(50, 'El username debe tener máximo 50 caracteres'),
  password: z.string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
  idRol: z.coerce.number().int().optional().nullable(),
  cedula: z.string().optional().nullable().refine(
    v => !v || CEDULA_REGEX.test(v),
    'La cédula debe tener formato V/E-12345678',
  ),
  nombre1: z.string().optional().nullable()
    .refine(v => !v || NAME_REGEX.test(v), 'El nombre solo puede contener letras y espacios')
    .refine(v => !v || v.length <= 50, 'El nombre debe tener máximo 50 caracteres'),
  nombre2: z.string().optional().nullable()
    .refine(v => !v || NAME_REGEX.test(v), 'El nombre solo puede contener letras y espacios')
    .refine(v => !v || v.length <= 50, 'El nombre debe tener máximo 50 caracteres'),
  apellido1: z.string().optional().nullable()
    .refine(v => !v || NAME_REGEX.test(v), 'El apellido solo puede contener letras y espacios')
    .refine(v => !v || v.length <= 50, 'El apellido debe tener máximo 50 caracteres'),
  apellido2: z.string().optional().nullable()
    .refine(v => !v || NAME_REGEX.test(v), 'El apellido solo puede contener letras y espacios')
    .refine(v => !v || v.length <= 50, 'El apellido debe tener máximo 50 caracteres'),
  correo: z.string().optional().nullable().refine(
    v => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
    'Debe ser un correo electrónico válido',
  ),
  telefono: z.string().optional().nullable().refine(
    v => !v || PHONE_REGEX.test(v),
    'El teléfono debe tener formato xxxx-xxxxxxx',
  ),
  fecha_nac: z.string().optional().nullable(),
  id_especialidad: z.coerce.number().int().positive().optional().nullable(),
  estatus: z.string().optional().nullable(),
}).superRefine((data, ctx) => {
  if (data.idRol === undefined || data.idRol === null) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['idRol'],
      message: 'El idRol es requerido',
    });
    return;
  }

  if (![4, 5, 7, 8].includes(data.idRol)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['idRol'],
      message: 'El rol no es válido. Valores: 4 (Admin), 5 (Docente), 7 (Coord), 8 (Control Estudios)',
    });
  }

  if (!data.cedula) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['cedula'],
      message: 'La cédula es requerida',
    });
  }
  if (!data.nombre1) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['nombre1'],
      message: 'El nombre es requerido',
    });
  }
  if (!data.apellido1) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['apellido1'],
      message: 'El apellido es requerido',
    });
  }
  if (data.idRol === 5 && !data.fecha_nac) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['fecha_nac'],
      message: 'La fecha de nacimiento es requerida para docentes',
    });
  }
});

export const validateCrearUsuario = validateZod(crearUsuarioSchema);
