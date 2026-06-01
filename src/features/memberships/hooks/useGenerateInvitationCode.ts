import { useMutation, useQueryClient } from '@tanstack/react-query'
import { invitationCodeService } from '../services/invitation-code.service'
import { mapInvitationCodeResponseToInvitationCode } from '../mappers/invitation-code.mapper'
import type { GenerateInvitationCodeRequestDTO } from '../services/invitation-code.service'

const INVITATION_CODES_QUERY_KEY = 'invitation-codes'
const INVITATION_CODE_STATS_QUERY_KEY = 'invitation-code-stats'

export function useGenerateInvitationCode(organizationId: string | null) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (dto: GenerateInvitationCodeRequestDTO) => {
      const response = await invitationCodeService.generate(dto)
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
