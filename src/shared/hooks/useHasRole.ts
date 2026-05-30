import { useAuthStore } from '@/shared/store/authStore'
import type { UserOrganizationRole } from '@/shared/types/user-organization-role.enum'

export function useHasRole(...roles: UserOrganizationRole[]): boolean {
  const userRole = useAuthStore((state) => state.role)
  if (!userRole) return false
  return roles.includes(userRole)
}
