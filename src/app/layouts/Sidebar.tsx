import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Menu, X } from 'lucide-react'
import { useLayoutStore } from '@/shared/store/layoutStore'
import { useAuthStore } from '@/shared/store/authStore'
import { navigationItems } from './navigation.config'
import { SidebarItem } from './SidebarItem'
import { SidebarFooter } from './SidebarFooter'

export function Sidebar() {
  const { t } = useTranslation('auth')
  const {
    sidebarCollapsed,
    sidebarMobileOpen,
    toggleSidebar,
    closeMobileSidebar,
  } = useLayoutStore()

  const allowsManualEntry = useAuthStore(
    (state) => state.organizationSettings?.allowManualEntries ?? false
  )

  const visibleNavItems = useMemo(() => {
    return navigationItems
      .map((item) => {
        if (!item.children) return item
        return {
          ...item,
          children: item.children.filter(
            (child) => !child.requireManualEntries || allowsManualEntry
          ),
        }
      })
      .filter((item) => {
        if (!item.children) return true
        return item.children.length > 0
      })
  }, [allowsManualEntry])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMobileSidebar()
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [closeMobileSidebar])

  return (
    <>
      {sidebarMobileOpen && (
        <div
          className="fixed inset-0 z-overlay bg-overlay lg:hidden"
          onClick={closeMobileSidebar}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-modal flex flex-col bg-card border-r border-border transition-all duration-300 ease-standard ${
          sidebarCollapsed ? 'lg:w-20' : 'lg:w-64'
        } ${
          sidebarMobileOpen
            ? 'translate-x-0 w-72'
            : '-translate-x-full lg:translate-x-0'
        }`}
      >

        <div className="flex items-center justify-between h-16 px-4 border-b border-border">
          {!sidebarCollapsed && (
            <span className="text-lg font-bold text-foreground truncate">
              {t('app.name')}
            </span>
          )}
          <button
            type="button"
            onClick={toggleSidebar}
            className="hidden lg:flex p-2 rounded-lg hover:bg-muted transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5 text-muted-foreground" />
          </button>
          <button
            type="button"
            onClick={closeMobileSidebar}
            className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 space-y-1 px-2">
          {visibleNavItems.map((item, index) => (
            <SidebarItem
              key={`${item.label}-${index}`}
              item={item}
              collapsed={sidebarCollapsed}
            />
          ))}
        </nav>

        <SidebarFooter />
      </aside>
    </>
  )
}
