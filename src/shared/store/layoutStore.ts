import { create } from 'zustand'

interface LayoutState {
  sidebarCollapsed: boolean
  sidebarMobileOpen: boolean
  toggleSidebar: () => void
  toggleMobileSidebar: () => void
  closeMobileSidebar: () => void
}

export const useLayoutStore = create<LayoutState>((set) => ({
  sidebarCollapsed: false,
  sidebarMobileOpen: false,

  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

  toggleMobileSidebar: () =>
    set((state) => ({ sidebarMobileOpen: !state.sidebarMobileOpen })),

  closeMobileSidebar: () => set({ sidebarMobileOpen: false }),
}))
