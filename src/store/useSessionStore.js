import { create } from 'zustand'

export const useSessionStore = create((set) => ({
  sidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  activeChatSessionId: null,
  setActiveChatSessionId: (id) => set({ activeChatSessionId: id }),
}))
