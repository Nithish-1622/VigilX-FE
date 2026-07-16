import { create } from 'zustand'

interface SessionState {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  activeChatSessionId: string | null;
  setActiveChatSessionId: (id: string | null) => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  sidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  activeChatSessionId: null,
  setActiveChatSessionId: (id) => set({ activeChatSessionId: id }),
}))
