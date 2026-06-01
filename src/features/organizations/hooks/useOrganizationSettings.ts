import { useQuery } from '@tanstack/react-query'
import { organizationService } from '../services/organization.service'
import { mapOrganizationSettingsResponseToOrganizationSettings } from '../mappers/organization-settings.mapper'

const ORGANIZATION_SETTINGS_QUERY_KEY = 'organization-settings'

export function useOrganizationSettings(organizationId: string | null) {
  return useQuery({
    queryKey: [ORGANIZATION_SETTINGS_QUERY_KEY, organizationId],
    queryFn: async () => {
      if (!organizationId) throw new Error('Organization ID is required')
      const response = await organizationService.getSettings(organizationId)
      return mapOrganizationSettingsResponseToOrganizationSettings(response.data.data)
    },
    enabled: !!organizationId,
    staleTime: 5 * 60 * 1000,
  })
}
