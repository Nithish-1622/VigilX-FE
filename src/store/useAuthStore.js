import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create()(
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
