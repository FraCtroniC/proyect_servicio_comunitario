import { DEFAULT_USERS, type StoredUser } from '@/data/users';
import {
  LOGIN_LOCKOUT_MS,
  LOGIN_MAX_ATTEMPTS,
  RECOVERY_LOCKOUT_MS,
  RECOVERY_MAX_ATTEMPTS,
} from '@/lib/security/constants';
import { validatePasswordInput, validateUserNameInput } from '@/lib/security/inputValidation';
import { createSalt, hashPassword, verifyPassword } from '@/lib/security/passwordHash';
import { clearAttempts, isRateLimited, registerFailedAttempt } from '@/lib/security/rateLimiter';

const STORAGE_KEY = 'liceo-auth-users';

type LegacyUser = {
  userName: string;
  displayName?: string;
  password?: string;
  passwordHash?: string;
  salt?: string;
};

async function toSecureUser(entry: { userName: string; displayName: string; plainPassword: string }): Promise<StoredUser> {
  const salt = createSalt();
  const passwordHash = await hashPassword(entry.plainPassword, salt);
  return {
    userName: entry.userName.toLowerCase(),
    displayName: entry.displayName,
    passwordHash,
    salt,
  };
}

function readUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as LegacyUser[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((u) => u.userName && u.passwordHash && u.salt)
      .map((u) => ({
        userName: u.userName.toLowerCase(),
        displayName: u.displayName ?? u.userName,
        passwordHash: u.passwordHash!,
        salt: u.salt!,
      }));
  } catch {
    return [];
  }
}

function writeUsers(users: StoredUser[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

async function migrateLegacyUsers(raw: LegacyUser[]): Promise<StoredUser[]> {
  const migrated: StoredUser[] = [];
  for (const user of raw) {
    if (user.passwordHash && user.salt && user.userName) {
      migrated.push({
        userName: user.userName.toLowerCase(),
        displayName: user.displayName ?? user.userName,
        passwordHash: user.passwordHash,
        salt: user.salt,
      });
      continue;
    }
    if (user.userName && user.password) {
      migrated.push(
        await toSecureUser({
          userName: user.userName,
          displayName: user.displayName ?? user.userName,
          plainPassword: user.password,
        }),
      );
    }
  }
  return migrated;
}

export async function ensureDefaultUsers() {
  let users = readUsers();

  if (users.length === 0) {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const legacy = JSON.parse(raw) as LegacyUser[];
        users = await migrateLegacyUsers(legacy);
      } catch {
        users = [];
      }
    }
  }

  for (const def of DEFAULT_USERS) {
    if (!users.some((u) => u.userName === def.userName.toLowerCase())) {
      users.push(await toSecureUser(def));
    }
  }

  writeUsers(users);
}

export function findUser(userName: string): StoredUser | undefined {
  const parsed = validateUserNameInput(userName);
  if (!parsed.ok) return undefined;
  return readUsers().find((u) => u.userName === parsed.value);
}

export async function validateCredentials(
  userName: string,
  password: string,
): Promise<{ ok: true; user: StoredUser } | { ok: false; message: string }> {
  const scope = 'login';
  const lock = isRateLimited(scope, LOGIN_MAX_ATTEMPTS);
  if (lock.limited) {
    return {
      ok: false,
      message: `Demasiados intentos fallidos. Espera ${lock.retryAfterMinutes ?? 15} minutos.`,
    };
  }

  const userParsed = validateUserNameInput(userName);
  if (!userParsed.ok) {
    registerFailedAttempt(scope, LOGIN_MAX_ATTEMPTS, LOGIN_LOCKOUT_MS);
    return { ok: false, message: 'Usuario o contraseña incorrectos.' };
  }

  const passParsed = validatePasswordInput(password, { forLogin: true });
  if (!passParsed.ok) {
    registerFailedAttempt(scope, LOGIN_MAX_ATTEMPTS, LOGIN_LOCKOUT_MS);
    return { ok: false, message: 'Usuario o contraseña incorrectos.' };
  }

  const user = readUsers().find((u) => u.userName === userParsed.value);
  if (!user) {
    registerFailedAttempt(scope, LOGIN_MAX_ATTEMPTS, LOGIN_LOCKOUT_MS);
    return { ok: false, message: 'Usuario o contraseña incorrectos.' };
  }

  const valid = await verifyPassword(passParsed.value, user.salt, user.passwordHash);
  if (!valid) {
    const attempt = registerFailedAttempt(scope, LOGIN_MAX_ATTEMPTS, LOGIN_LOCKOUT_MS);
    if (attempt.limited) {
      return {
        ok: false,
        message: `Cuenta bloqueada temporalmente. Intenta en ${attempt.retryAfterMinutes ?? 15} minutos.`,
      };
    }
    return { ok: false, message: 'Usuario o contraseña incorrectos.' };
  }

  clearAttempts(scope);
  return { ok: true, user };
}

export async function updatePassword(
  userName: string,
  newPassword: string,
): Promise<{ ok: true } | { ok: false; message: string }> {
  const scope = 'recovery';
  const lock = isRateLimited(scope, RECOVERY_MAX_ATTEMPTS);
  if (lock.limited) {
    return {
      ok: false,
      message: `Demasiados intentos. Espera ${lock.retryAfterMinutes ?? 30} minutos.`,
    };
  }

  const userParsed = validateUserNameInput(userName);
  if (!userParsed.ok) {
    registerFailedAttempt(scope, RECOVERY_MAX_ATTEMPTS, RECOVERY_LOCKOUT_MS);
    return { ok: false, message: userParsed.message };
  }

  const passParsed = validatePasswordInput(newPassword, { userName: userParsed.value });
  if (!passParsed.ok) {
    registerFailedAttempt(scope, RECOVERY_MAX_ATTEMPTS, RECOVERY_LOCKOUT_MS);
    return { ok: false, message: passParsed.message };
  }

  const users = readUsers();
  const index = users.findIndex((u) => u.userName === userParsed.value);
  if (index === -1) {
    registerFailedAttempt(scope, RECOVERY_MAX_ATTEMPTS, RECOVERY_LOCKOUT_MS);
    return { ok: false, message: 'No se pudo actualizar la contraseña.' };
  }

  const salt = createSalt();
  const passwordHash = await hashPassword(passParsed.value, salt);
  users[index] = { ...users[index], passwordHash, salt };
  writeUsers(users);
  clearAttempts(scope);
  clearAttempts('login');
  return { ok: true };
}

export function lookupUserForRecovery(
  userName: string,
): { ok: true; userName: string } | { ok: false; message: string } {
  const scope = 'recovery';
  const lock = isRateLimited(scope, RECOVERY_MAX_ATTEMPTS);
  if (lock.limited) {
    return {
      ok: false,
      message: `Demasiados intentos. Espera ${lock.retryAfterMinutes ?? 30} minutos.`,
    };
  }

  const parsed = validateUserNameInput(userName);
  if (!parsed.ok) {
    registerFailedAttempt(scope, RECOVERY_MAX_ATTEMPTS, RECOVERY_LOCKOUT_MS);
    return { ok: false, message: 'No encontramos ese usuario. Verifica el nombre e intenta de nuevo.' };
  }

  const user = readUsers().find((u) => u.userName === parsed.value);
  if (!user) {
    registerFailedAttempt(scope, RECOVERY_MAX_ATTEMPTS, RECOVERY_LOCKOUT_MS);
    return { ok: false, message: 'No encontramos ese usuario. Verifica el nombre e intenta de nuevo.' };
  }

  return { ok: true, userName: user.userName };
}
