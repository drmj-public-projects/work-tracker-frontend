import { useTranslation } from 'react-i18next'
import { Sun, Moon } from 'lucide-react'
import { useThemeStore } from '@/shared/store/themeStore'

export function ThemeToggle() {
  const { t } = useTranslation('auth')
  const { isDark, toggleTheme } = useThemeStore()

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="p-2 rounded-lg hover:bg-muted transition-colors"
      aria-label={isDark ? t('theme.light') : t('theme.dark')}
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-foreground" />
      ) : (
        <Moon className="w-5 h-5 text-foreground" />
      )}
    </button>
  )
}
