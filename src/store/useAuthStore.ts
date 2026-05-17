import { create } from 'zustand';

type AuthState = {
  userName: string | null;
  isAuthenticated: boolean;
  signIn: (userName: string) => void;
  signOut: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  userName: null,
  isAuthenticated: false,
  signIn: (userName: string) => set({ userName, isAuthenticated: true }),
  signOut: () => set({ userName: null, isAuthenticated: false }),
}));