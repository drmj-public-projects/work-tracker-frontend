import { useQuery } from '@tanstack/react-query'
import { organizationService } from '../services/organization.service'
import { mapOrganizationResponseToOrganization } from '../mappers/organization.mapper'

const ORGANIZATIONS_QUERY_KEY = 'organizations'

export function useOrganizations() {
  return useQuery({
    queryKey: [ORGANIZATIONS_QUERY_KEY],
    queryFn: async () => {
      const response = await organizationService.getOrganizations()
      return response.data.data.map(mapOrganizationResponseToOrganization)
    },
  })
}