import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { LogOut, User, Settings } from 'lucide-react'
import { useAuthStore } from '@/shared/store/authStore'
import { useInitials } from '@/shared/hooks/useInitials'

export function UserMenu() {
  const { t } = useTranslation('auth')
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const [isOpen, setIsOpen] = useState(false)

  const initials = useInitials(user?.name || '')

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-muted transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
          <span className="text-sm font-semibold text-primary-foreground">
            {initials || '?'}
          </span>
        </div>
        {user && (
          <span className="text-sm font-medium text-foreground hidden md:block">
            {user.name}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-popover"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-56 bg-card rounded-xl shadow-lg border border-border z-popover overflow-hidden">
            <div className="p-4 border-b border-border">
              <p className="text-sm font-semibold text-foreground">
                {user?.name || t('userMenu.guest')}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email || ''}
              </p>
            </div>

            <div className="py-2">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false)
                  navigate('/profile')
                }}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
              >
                <User className="w-4 h-4 text-muted-foreground" />
                {t('userMenu.viewProfile')}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false)
                  navigate('/profile/edit')
                }}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
              >
                <Settings className="w-4 h-4 text-muted-foreground" />
                {t('userMenu.editProfile')}
              </button>
            </div>

            <div className="py-2 border-t border-border">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                {t('userMenu.logout')}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
