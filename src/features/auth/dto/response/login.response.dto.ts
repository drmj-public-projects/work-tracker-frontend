import type { UserResponseDTO } from '@/shared/types/user.response.dto'
import type { OrganizationResponseDTO } from '@/shared/types/organization.response.dto'

export interface LoginResponseDTO {
  token: string
  user: UserResponseDTO
  organizationList: OrganizationResponseDTO[]
}
