import { z } from 'zod';
import { PASSWORD_MAX, USERNAME_MAX, USERNAME_MIN } from './constants';
import { containsMaliciousPattern } from './inputValidation';

const safeUserName = z
  .string()
  .min(USERNAME_MIN, `Mínimo ${USERNAME_MIN} caracteres`)
  .max(USERNAME_MAX, `Máximo ${USERNAME_MAX} caracteres`)
  .regex(/^[a-zA-Z0-9._-]+$/, 'Caracteres no permitidos en el usuario')
  .refine((v) => !containsMaliciousPattern(v), 'Entrada no permitida');

const safePassword = z
  .string()
  .min(1, 'La contraseña es requerida')
  .max(PASSWORD_MAX, `Máximo ${PASSWORD_MAX} caracteres`)
  .refine((v) => !/\s/.test(v), 'Sin espacios en la contraseña')
  .refine((v) => !containsMaliciousPattern(v), 'Entrada no permitida');

export const loginSchema = z.object({
  userName: safeUserName,
  password: safePassword,
  website: z.string().optional(),
});

export const recoveryLookupSchema = z.object({
  userName: safeUserName,
});

export const recoveryResetSchema = z
  .object({
    password: safePassword.min(4, 'Mínimo 4 caracteres'),
    confirmPassword: z.string().min(4, 'Confirma la contraseña'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RecoveryLookupData = z.infer<typeof recoveryLookupSchema>;
export type RecoveryResetData = z.infer<typeof recoveryResetSchema>;
