import { useTranslation } from 'react-i18next'
import { Globe } from 'lucide-react'

export function LanguageToggle() {
  const { i18n } = useTranslation('auth')

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'es' ? 'en' : 'es'
    i18n.changeLanguage(nextLang)
  }

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className="p-2 rounded-lg hover:bg-muted transition-colors flex items-center gap-1.5 text-sm font-medium text-foreground"
    >
      <Globe className="w-4 h-4" />
      <span className="hidden sm:inline">
        {i18n.language === 'es' ? 'EN' : 'ES'}
      </span>
    </button>
  )
}
