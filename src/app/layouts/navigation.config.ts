import type { UserOrganizationRole } from '@/shared/types/user-organization-role.enum'

export interface NavItem {
  label: string
  icon: string
  path?: string
  roles?: UserOrganizationRole[]
  requireManualEntries?: boolean
  children?: NavItem[]
}

export const navigationItems: NavItem[] = [
  {
    label: 'nav.dashboard',
    icon: 'LayoutDashboard',
    path: '/dashboard',
  },
  {
    label: 'nav.workSessions',
    icon: 'Timer',
    children: [
      {
        label: 'nav.activeTimer',
        icon: 'Play',
        path: '/work-sessions/timer',
      },
      {
        label: 'nav.manualEntry',
        icon: 'Plus',
        path: '/work-sessions/manual',
        requireManualEntries: true,
      },
    ],
  },
  {
    label: 'nav.places',
    icon: 'MapPin',
    path: '/places',
  },
  {
    label: 'nav.reports',
    icon: 'BarChart3',
    children: [
      {
        label: 'nav.analytics',
        icon: 'BarChart3',
        path: '/reports/analytics',
      },
      {
        label: 'nav.calendar',
        icon: 'Calendar',
        path: '/reports/calendar',
      },
      {
        label: 'nav.history',
        icon: 'Clock',
        path: '/reports/history',
      },
    ],
  },
  {
    label: 'nav.settings',
    icon: 'Settings',
    path: '/settings',
    roles: ['ADMIN'],
  },
]
