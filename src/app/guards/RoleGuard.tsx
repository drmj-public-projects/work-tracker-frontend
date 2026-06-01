import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/shared/store/authStore'
import type { UserOrganizationRole } from '@/shared/types/user-organization-role.enum'

interface RoleGuardProps {
  allowedRoles: UserOrganizationRole[]
}

export function RoleGuard({ allowedRoles }: RoleGuardProps) {
  const userRole = useAuthStore((state) => state.role)

  if (!userRole || !allowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}
