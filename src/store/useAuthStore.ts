import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  username: string;
  badgeNumber?: string;
  department?: string;
  role?: string;
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (tokens: { access: string; refresh: string }, user: User) => void;
  logout: () => void;
  setTokens: (tokens: { access: string; refresh: string }) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      login: (tokens, user) => set({
        accessToken: tokens.access,
        refreshToken: tokens.refresh,
        user,
        isAuthenticated: true,
      }),
      logout: () => set({
        accessToken: null,
        refreshToken: null,
        user: null,
        isAuthenticated: false,
      }),
      setTokens: (tokens) => set({
        accessToken: tokens.access,
        refreshToken: tokens.refresh,
      }),
    }),
    {
      name: 'vigilx-auth-storage',
    }
  )
)
