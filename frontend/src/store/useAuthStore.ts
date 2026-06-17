import { create } from 'zustand';
import { SESSION_MAX_AGE_MS } from '@/lib/security/constants';

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
  token: string | null;
  signIn: (userName: string, password: string) => Promise<{ ok: true } | { ok: false; message: string }>;
  signOut: () => void;
  syncSession: () => void;
  touchSession: () => void;
};

const SESSION_KEY = 'liceo-auth-session';

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

function sessionToState(session: SessionPayload | null): Pick<AuthState, 'userName' | 'displayName' | 'isAuthenticated' | 'token'> {
  if (!session) {
    return { userName: null, displayName: null, isAuthenticated: false, token: null };
  }
  return {
    userName: session.userName,
    displayName: session.displayName,
    isAuthenticated: true,
    token: session.sessionToken,
  };
}

const initialSession = readSession();

export const useAuthStore = create<AuthState>((set) => ({
  ...sessionToState(initialSession),

  signIn: async (userName, password) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: userName, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        return { ok: false, message: data.message || 'Usuario o contraseña incorrectos.' };
      }

      const session: SessionPayload = {
        userName: data.user.userName,
        displayName: data.user.displayName,
        expiresAt: Date.now() + SESSION_MAX_AGE_MS,
        sessionToken: data.token,
      };

      writeSession(session);
      set(sessionToState(session));
      return { ok: true };
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      return { ok: false, message: 'No se pudo conectar con el servidor. Verifique su conexión.' };
    }
  },

  signOut: () => {
    sessionStorage.removeItem(SESSION_KEY);
    set({ userName: null, displayName: null, isAuthenticated: false, token: null });
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
