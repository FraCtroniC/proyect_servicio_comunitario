import { create } from 'zustand';
import { validateCredentials } from '@/services/authCredentials';

type AuthState = {
  userName: string | null;
  displayName: string | null;
  isAuthenticated: boolean;
  signIn: (userName: string, password: string) => { ok: true } | { ok: false; message: string };
  signOut: () => void;
};

const SESSION_KEY = 'liceo-auth-session';

function loadSession(): Pick<AuthState, 'userName' | 'displayName' | 'isAuthenticated'> {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return { userName: null, displayName: null, isAuthenticated: false };
    const data = JSON.parse(raw) as { userName: string; displayName: string };
    return { userName: data.userName, displayName: data.displayName, isAuthenticated: true };
  } catch {
    return { userName: null, displayName: null, isAuthenticated: false };
  }
}

const initial = loadSession();

export const useAuthStore = create<AuthState>((set) => ({
  userName: initial.userName,
  displayName: initial.displayName,
  isAuthenticated: initial.isAuthenticated,

  signIn: (userName, password) => {
    const user = validateCredentials(userName, password);
    if (!user) {
      return { ok: false, message: 'Usuario o contraseña incorrectos.' };
    }
    sessionStorage.setItem(
      SESSION_KEY,
      JSON.stringify({ userName: user.userName, displayName: user.displayName }),
    );
    set({
      userName: user.userName,
      displayName: user.displayName,
      isAuthenticated: true,
    });
    return { ok: true };
  },

  signOut: () => {
    sessionStorage.removeItem(SESSION_KEY);
    set({ userName: null, displayName: null, isAuthenticated: false });
  },
}));
