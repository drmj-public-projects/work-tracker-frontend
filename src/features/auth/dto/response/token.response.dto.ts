import { UserOrganizationRole } from '@/shared/types/user-organization-role.enum'

export interface TokenResponseDTO {
  token: string
  organizationId: string
  role: UserOrganizationRole
}
