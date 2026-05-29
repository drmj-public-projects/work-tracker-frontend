import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { LogOut, Building2 } from 'lucide-react'
import { useAuthStore } from '@/shared/store/authStore'
import { useLayoutStore } from '@/shared/store/layoutStore'

export function SidebarFooter() {
  const { t } = useTranslation('auth')
  const navigate = useNavigate()
  const logout = useAuthStore((state) => state.logout)
  const { sidebarCollapsed, closeMobileSidebar } = useLayoutStore()

  const handleSwitchOrg = () => {
    closeMobileSidebar()
    navigate('/select-organization')
  }

  const handleLogout = () => {
    closeMobileSidebar()
    logout()
    navigate('/login')
  }

  return (
    <div className="p-2 border-t border-border space-y-1">
      <button
        type="button"
        onClick={handleSwitchOrg}
        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/50 rounded-lg"
      >
        <Building2 className="w-5 h-5 shrink-0" />
        {!sidebarCollapsed && <span>{t('sidebar.switchOrganization')}</span>}
      </button>

      <button
        type="button"
        onClick={handleLogout}
        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 rounded-lg"
      >
        <LogOut className="w-5 h-5 shrink-0" />
        {!sidebarCollapsed && <span>{t('sidebar.logout')}</span>}
      </button>
    </div>
  )
}
