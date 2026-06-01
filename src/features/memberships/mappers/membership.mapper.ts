import type { MembershipResponseDTO } from '../dto/response/membership.response.dto'
import type { Membership } from '../models/membership.model'

export function mapMembershipResponseToMembership(dto: MembershipResponseDTO): Membership {
  return {
    id: dto.id,
    userId: dto.userId,
    organizationId: dto.organizationId,
    organizationName: dto.organizationName,
    role: dto.role,
    joinedAt: new Date(dto.joinedAt),
    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt),
  }
}
