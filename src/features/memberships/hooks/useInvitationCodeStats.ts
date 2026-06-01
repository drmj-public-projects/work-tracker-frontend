import { useQuery } from '@tanstack/react-query'
import { invitationCodeService } from '../services/invitation-code.service'
import { mapInvitationCodeStatsResponseToInvitationCodeStats } from '../mappers/invitation-code-stats.mapper'

const INVITATION_CODE_STATS_QUERY_KEY = 'invitation-code-stats'

export function useInvitationCodeStats(organizationId: string | null) {
  return useQuery({
    queryKey: [INVITATION_CODE_STATS_QUERY_KEY, organizationId],
    queryFn: async () => {
      if (!organizationId) throw new Error('Organization ID is required')
      const response = await invitationCodeService.getStats(organizationId)
      return mapInvitationCodeStatsResponseToInvitationCodeStats(response.data.data)
    },
    enabled: !!organizationId,
    staleTime: 5 * 60 * 1000,
  })
}
