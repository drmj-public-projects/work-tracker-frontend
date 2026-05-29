import { create } from 'zustand'

const STORAGE_KEY = 'work_tracker_theme'

interface ThemeState {
  isDark: boolean
  toggleTheme: () => void
  setTheme: (dark: boolean) => void
  hydrateFromStorage: () => void
}

export const useThemeStore = create<ThemeState>((set) => ({
  isDark: false,

  toggleTheme: () =>
    set((state) => {
      const next = !state.isDark
      if (next) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
      localStorage.setItem(STORAGE_KEY, next ? 'dark' : 'light')
      return { isDark: next }
    }),

  setTheme: (dark: boolean) => {
    if (dark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light')
    set({ isDark: dark })
  },

  hydrateFromStorage: () => {
    const stored = localStorage.getItem(STORAGE_KEY)
    let isDark: boolean

    if (stored === 'dark') {
      isDark = true
    } else if (stored === 'light') {
      isDark = false
    } else {
      // Check system preference
      isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    }

    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }

    set({ isDark })
  },
}))
