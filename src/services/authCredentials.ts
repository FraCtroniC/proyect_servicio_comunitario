import { DEFAULT_USERS, type StoredUser } from '@/data/users';

const STORAGE_KEY = 'liceo-auth-users';

function readUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [...DEFAULT_USERS];
    const parsed = JSON.parse(raw) as StoredUser[];
    if (!Array.isArray(parsed) || parsed.length === 0) return [...DEFAULT_USERS];
    return parsed;
  } catch {
    return [...DEFAULT_USERS];
  }
}

function writeUsers(users: StoredUser[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

export function findUser(userName: string): StoredUser | undefined {
  const normalized = userName.trim().toLowerCase();
  return readUsers().find((u) => u.userName.toLowerCase() === normalized);
}

export function validateCredentials(userName: string, password: string): StoredUser | null {
  const user = findUser(userName);
  if (!user || user.password !== password) return null;
  return user;
}

export function updatePassword(userName: string, newPassword: string): boolean {
  const users = readUsers();
  const normalized = userName.trim().toLowerCase();
  const index = users.findIndex((u) => u.userName.toLowerCase() === normalized);
  if (index === -1) return false;
  users[index] = { ...users[index], password: newPassword };
  writeUsers(users);
  return true;
}

export function resetUsersToDefaults() {
  writeUsers([...DEFAULT_USERS]);
}

export function ensureDefaultUsers() {
  const users = readUsers();
  let changed = false;
  for (const def of DEFAULT_USERS) {
    if (!users.some((u) => u.userName.toLowerCase() === def.userName.toLowerCase())) {
      users.push(def);
      changed = true;
    }
  }
  if (changed) writeUsers(users);
}
