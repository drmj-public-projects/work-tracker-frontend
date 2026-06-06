import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  LayoutDashboard,
  Timer,
  Play,
  Plus,
  MapPin,
  BarChart3,
  Settings,
  Calendar,
  Clock,
  ChevronDown,
  Users,
  Ticket,
  Banknote,
  type LucideIcon,
} from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/shared/store/authStore'
import type { NavItem } from './navigation.config'

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  Timer,
  Play,
  Plus,
  MapPin,
  BarChart3,
  Settings,
  Calendar,
  Clock,
  Users,
  Ticket,
  Banknote,
}

interface SidebarItemProps {
  item: NavItem
  collapsed: boolean
  depth?: number
}

export function SidebarItem({ item, collapsed, depth = 0 }: SidebarItemProps) {
  const { t } = useTranslation('auth')
  const location = useLocation()
  const [isExpanded, setIsExpanded] = useState(() => {
    if (!item.children) return false
    return item.children.some((child) =>
      child.path ? location.pathname.startsWith(child.path) : false
    )
  })

  // Role check
  const userRole = useAuthStore((state) => state.role)
  if (item.roles && item.roles.length > 0) {
    const hasAccess = userRole ? item.roles.includes(userRole) : false
    if (!hasAccess) return null
  }

  const IconComponent = iconMap[item.icon]
  const isActive = item.path ? location.pathname === item.path : false
  const hasChildren = item.children && item.children.length > 0
  const isChildActive = hasChildren
    ? item.children!.some((child) =>
        child.path ? location.pathname === child.path : false
      )
    : false

  const handleParentClick = () => {
    if (hasChildren) {
      setIsExpanded((prev) => !prev)
    }
  }

  const paddingClass = depth === 0 ? 'px-4' : 'pl-12 pr-4'

  if (hasChildren) {
    return (
      <div>
        <button
          type="button"
          onClick={handleParentClick}
          className={`w-full flex items-center gap-3 ${paddingClass} py-3 text-sm font-medium transition-colors hover:bg-muted/50 rounded-lg ${
            isChildActive
              ? 'text-primary bg-primary/10'
              : 'text-muted-foreground'
          }`}
        >
          {IconComponent && (
            <IconComponent
              className={`w-5 h-5 shrink-0 ${
                isChildActive ? 'text-primary' : 'text-muted-foreground'
              }`}
            />
          )}
          {!collapsed && (
            <>
              <span className="flex-1 text-left">{t(item.label)}</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  isExpanded ? 'rotate-180' : ''
                }`}
              />
            </>
          )}
        </button>

        {!collapsed && isExpanded && (
          <div className="mt-1 space-y-1">
            {item.children!.map((child, index) => (
              <SidebarItem
                key={`${child.label}-${index}`}
                item={child}
                collapsed={collapsed}
                depth={depth + 1}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  if (!item.path) return null

  return (
    <Link
      to={item.path}
      className={`flex items-center gap-3 ${paddingClass} py-3 text-sm font-medium transition-colors hover:bg-muted/50 rounded-lg ${
        isActive
          ? 'text-primary bg-primary/10 border-l-4 border-primary'
          : 'text-muted-foreground'
      }`}
    >
      {IconComponent && (
        <IconComponent
          className={`w-5 h-5 shrink-0 ${
            isActive ? 'text-primary' : 'text-muted-foreground'
          }`}
        />
      )}
      {!collapsed && <span>{t(item.label)}</span>}
    </Link>
  )
}
