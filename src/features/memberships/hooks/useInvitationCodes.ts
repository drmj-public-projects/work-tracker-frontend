import { useQuery } from '@tanstack/react-query'
import { invitationCodeService } from '../services/invitation-code.service'
import { mapInvitationCodeResponseToInvitationCode } from '../mappers/invitation-code.mapper'

const INVITATION_CODES_QUERY_KEY = 'invitation-codes'

export function useInvitationCodes(
  organizationId: string | null,
  page: number = 0,
  size: number = 10
) {
  return useQuery({
    queryKey: [INVITATION_CODES_QUERY_KEY, organizationId, page, size],
    queryFn: async () => {
      if (!organizationId) throw new Error('Organization ID is required')
      const response = await invitationCodeService.getByOrganizationId(
        organizationId,
        page,
        size
      )
      const pageData = response.data.data
      return {
        content: pageData.content.map(mapInvitationCodeResponseToInvitationCode),
        totalElements: pageData.totalElements,
        totalPages: pageData.totalPages,
        number: pageData.number,
        size: pageData.size,
        first: pageData.first,
        last: pageData.last,
      }
    },
    enabled: !!organizationId,
    staleTime: 5 * 60 * 1000,
  })
}
