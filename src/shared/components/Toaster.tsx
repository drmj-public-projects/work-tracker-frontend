import { Toaster as Sonner } from 'sonner'
import { useThemeStore } from '@/shared/store/themeStore'

export function Toaster() {
  const isDark = useThemeStore((state) => state.isDark)

  return (
    <Sonner
      theme={isDark ? 'dark' : 'light'}
      position="top-right"
      toastOptions={{
        style: {
          background: 'var(--card)',
          color: 'var(--foreground)',
          border: '1px solid var(--border)',
          fontFamily: 'var(--font-sans)',
          boxShadow: 'var(--shadow-md)',
        },
      }}
    />
  )
}
