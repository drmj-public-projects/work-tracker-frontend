import type { OrganizationResponseDTO } from '@/shared/types/organization.response.dto'
import type { Organization } from '@/features/auth/models/organization.model'

export function mapOrganizationResponseToOrganization(dto: OrganizationResponseDTO): Organization {
  return {
    id: dto.id,
    name: dto.name,
    memberCount: dto.memberCount ?? 0,
  }
}