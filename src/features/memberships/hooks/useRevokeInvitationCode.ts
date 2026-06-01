import { useMutation, useQueryClient } from '@tanstack/react-query'
import { invitationCodeService } from '../services/invitation-code.service'
import { mapInvitationCodeResponseToInvitationCode } from '../mappers/invitation-code.mapper'

const INVITATION_CODES_QUERY_KEY = 'invitation-codes'
const INVITATION_CODE_STATS_QUERY_KEY = 'invitation-code-stats'

export function useRevokeInvitationCode(organizationId: string | null) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (invitationCodeId: string) => {
      const response = await invitationCodeService.revoke(invitationCodeId)
      return mapInvitationCodeResponseToInvitationCode(response.data.data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [INVITATION_CODES_QUERY_KEY, organizationId],
      })
      queryClient.invalidateQueries({
        queryKey: [INVITATION_CODE_STATS_QUERY_KEY, organizationId],
      })
    },
  })
}
