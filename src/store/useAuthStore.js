import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DEV_USER, isDevMode } from '../lib/env'

export const useAuthStore = create()(
  persist(
    (set) => ({
      accessToken: isDevMode ? 'dev-mock-access-token' : null,
      refreshToken: isDevMode ? 'dev-mock-refresh-token' : null,
      user: isDevMode ? DEV_USER : null,
      setTokens: ({ access, refresh }) => set((state) => ({
        accessToken: access,
        refreshToken: refresh ?? state.refreshToken,
      })),
      setUser: (user) => set({ user }),
      logout: () => set({
        accessToken: null,
        refreshToken: null,
        user: null,
      }),
    }),
    {
      name: 'vigilx-auth',
    }
  )
)
