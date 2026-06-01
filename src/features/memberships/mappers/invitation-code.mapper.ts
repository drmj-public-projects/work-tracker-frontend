import type { InvitationCodeResponseDTO } from '../dto/response/invitation-code.response.dto'
import type { InvitationCode } from '../models/invitation-code.model'

export function mapInvitationCodeResponseToInvitationCode(
  dto: InvitationCodeResponseDTO
): InvitationCode {
  return {
    id: dto.id,
    organizationId: dto.organizationId,
    code: dto.code,
    role: dto.role,
    expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
    maxUses: dto.maxUses,
    currentUses: dto.currentUses,
    isActive: dto.isActive,
    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt),
  }
}
