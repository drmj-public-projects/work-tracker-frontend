import type { LoginResponseDTO } from '../dto/response/login.response.dto'
import type { UserResponseDTO } from '@/shared/types/user.response.dto'
import type { OrganizationResponseDTO } from '@/shared/types/organization.response.dto'
import type { User } from '../models/user.model'
import type { Organization } from '../models/organization.model'

export function mapUserResponseToUser(dto: UserResponseDTO): User {
  return {
    id: dto.id,
    name: dto.name,
    email: dto.email,
    timezone: dto.timezone,
  }
}

export function mapOrganizationResponseToOrganization(
  dto: OrganizationResponseDTO
): Organization {
  return {
    id: dto.id,
    name: dto.name,
    memberCount: dto.memberCount ?? 0,
  }
}

export function mapLoginResponseToAuthData(dto: LoginResponseDTO) {
  return {
    token: dto.token,
    user: mapUserResponseToUser(dto.user),
  }
}
