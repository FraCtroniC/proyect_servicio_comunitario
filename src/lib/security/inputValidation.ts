import { PASSWORD_MAX, PASSWORD_MIN, USERNAME_MAX, USERNAME_MIN } from './constants';

const USERNAME_PATTERN = /^[a-zA-Z0-9._-]+$/;

const INJECTION_PATTERNS = [
  /<script\b/i,
  /javascript:/i,
  /on\w+\s*=/i,
  /data:\s*text\/html/i,
  /(\b)(union|select|insert|update|delete|drop|exec)(\b)/i,
  /--/,
  /;\s*--/,
  /'\s*or\s*'1'\s*=\s*'1/i,
  /\bor\s+1\s*=\s*1\b/i,
];

const BLOCKED_PASSWORDS = new Set([
  '1234',
  '12345',
  '123456',
  'password',
  'contraseña',
  'admin',
  'qwerty',
  '111111',
]);

export function sanitizeText(value: string, maxLength: number): string {
  return value
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .trim()
    .slice(0, maxLength);
}

export function containsMaliciousPattern(value: string): boolean {
  return INJECTION_PATTERNS.some((pattern) => pattern.test(value));
}

export function validateUserNameInput(raw: string): { ok: true; value: string } | { ok: false; message: string } {
  const value = sanitizeText(raw, USERNAME_MAX).toLowerCase();

  if (value.length < USERNAME_MIN) {
    return { ok: false, message: `El usuario debe tener entre ${USERNAME_MIN} y ${USERNAME_MAX} caracteres.` };
  }

  if (!USERNAME_PATTERN.test(value)) {
    return { ok: false, message: 'Solo se permiten letras, números, punto, guion y guion bajo.' };
  }

  if (containsMaliciousPattern(value)) {
    return { ok: false, message: 'Entrada no permitida por políticas de seguridad.' };
  }

  return { ok: true, value };
}

export function validatePasswordInput(
  raw: string,
  options?: { forLogin?: boolean; userName?: string },
): { ok: true; value: string } | { ok: false; message: string } {
  const value = raw.slice(0, PASSWORD_MAX);

  if (value.length < PASSWORD_MIN) {
    return { ok: false, message: `La contraseña debe tener al menos ${PASSWORD_MIN} caracteres.` };
  }

  if (/\s/.test(value)) {
    return { ok: false, message: 'La contraseña no puede contener espacios.' };
  }

  if (containsMaliciousPattern(value)) {
    return { ok: false, message: 'Contraseña no válida por políticas de seguridad.' };
  }

  if (!options?.forLogin) {
    if (BLOCKED_PASSWORDS.has(value.toLowerCase())) {
      return { ok: false, message: 'Esa contraseña es demasiado común. Elige otra más segura.' };
    }

    const userName = options?.userName?.toLowerCase();
    if (userName && value.toLowerCase().includes(userName)) {
      return { ok: false, message: 'La contraseña no puede incluir tu nombre de usuario.' };
    }
  }

  return { ok: true, value };
}

export function isHoneypotTriggered(value: string | undefined): boolean {
  return Boolean(value && value.trim().length > 0);
}
