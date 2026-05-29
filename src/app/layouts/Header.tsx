import { useTranslation } from 'react-i18next'
import { Menu } from 'lucide-react'
import { useLayoutStore } from '@/shared/store/layoutStore'
import { ThemeToggle } from '@/shared/components/ThemeToggle'
import { LanguageToggle } from '@/shared/components/LanguageToggle'
import { UserMenu } from './UserMenu'

export function Header() {
  const { t } = useTranslation('auth')
  const { toggleMobileSidebar } = useLayoutStore()

  return (
    <header className="h-16 flex items-center px-4 lg:px-6 border-b border-border bg-card">
      <div className="flex items-center gap-3 lg:hidden">
        <button
          type="button"
          onClick={toggleMobileSidebar}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5 text-foreground" />
        </button>
        <span className="text-lg font-bold text-foreground">{t('app.name')}</span>
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-2">
        <LanguageToggle />
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  )
}
