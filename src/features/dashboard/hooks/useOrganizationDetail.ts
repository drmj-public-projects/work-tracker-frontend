import { useQuery } from '@tanstack/react-query'
import { organizationService } from '@/features/organizations/services/organization.service'

const ORG_DETAIL_KEY = 'organizationDetail'

export function useOrganizationDetail(organizationId: string | null) {
  return useQuery({
    queryKey: [ORG_DETAIL_KEY, organizationId],
    queryFn: async () => {
      if (!organizationId) return null
      const response = await organizationService.getById(organizationId)
      return response.data.data.memberCount ?? null
    },
    enabled: !!organizationId,
    staleTime: 5 * 60 * 1000,
  })
}
