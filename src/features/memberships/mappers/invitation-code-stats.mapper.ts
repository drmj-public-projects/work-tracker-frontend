import type { InvitationCodeStatsResponseDTO } from '../dto/response/invitation-code-stats.response.dto'
import type { InvitationCodeStats } from '../models/invitation-code-stats.model'

export function mapInvitationCodeStatsResponseToInvitationCodeStats(
  dto: InvitationCodeStatsResponseDTO
): InvitationCodeStats {
  return {
    activeCodes: dto.activeCodes,
    totalUses: dto.totalUses,
    expiredCodes: dto.expiredCodes,
  }
}
