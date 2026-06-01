import { create } from 'zustand';
import { SESSION_MAX_AGE_MS } from '@/lib/security/constants';
import { validateCredentials } from '@/services/authCredentials';

type SessionPayload = {
  userName: string;
  displayName: string;
  expiresAt: number;
  sessionToken: string;
};

type AuthState = {
  userName: string | null;
  displayName: string | null;
  isAuthenticated: boolean;
  signIn: (userName: string, password: string) => Promise<{ ok: true } | { ok: false; message: string }>;
  signOut: () => void;
  syncSession: () => void;
  touchSession: () => void;
};

const SESSION_KEY = 'liceo-auth-session';

function createSessionToken(): string {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function readSession(): SessionPayload | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as SessionPayload;
    if (!data.userName || !data.sessionToken || !data.expiresAt) return null;
    if (Date.now() > data.expiresAt) return null;
    return data;
  } catch {
    return null;
  }
}

/** Lectura pura: seguro llamar durante el render. */
export function isSessionValid(): boolean {
  return readSession() !== null;
}

function writeSession(data: SessionPayload) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));
}

function sessionToState(session: SessionPayload | null): Pick<AuthState, 'userName' | 'displayName' | 'isAuthenticated'> {
  if (!session) {
    return { userName: null, displayName: null, isAuthenticated: false };
  }
  return {
    userName: session.userName,
    displayName: session.displayName,
    isAuthenticated: true,
  };
}

const initialSession = readSession();

export const useAuthStore = create<AuthState>((set) => ({
  ...sessionToState(initialSession),

  signIn: async (userName, password) => {
    const result = await validateCredentials(userName, password);
    if (!result.ok) {
      return { ok: false, message: result.message };
    }

    const session: SessionPayload = {
      userName: result.user.userName,
      displayName: result.user.displayName,
      expiresAt: Date.now() + SESSION_MAX_AGE_MS,
      sessionToken: createSessionToken(),
    };

    writeSession(session);
    set(sessionToState(session));
    return { ok: true };
  },

  signOut: () => {
    sessionStorage.removeItem(SESSION_KEY);
    set({ userName: null, displayName: null, isAuthenticated: false });
  },

  syncSession: () => {
    set(sessionToState(readSession()));
  },

  touchSession: () => {
    const session = readSession();
    if (!session) return;
    writeSession({ ...session, expiresAt: Date.now() + SESSION_MAX_AGE_MS });
  },
}));
