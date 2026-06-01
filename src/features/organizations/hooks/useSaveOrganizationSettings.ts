import { useMutation, useQueryClient } from '@tanstack/react-query'
import { organizationService } from '../services/organization.service'
import { mapOrganizationSettingsResponseToOrganizationSettings } from '../mappers/organization-settings.mapper'
import type { SaveOrganizationSettingsRequestDTO } from '../dto/request/save-organization-settings.request.dto'

const ORGANIZATION_SETTINGS_QUERY_KEY = 'organization-settings'

export function useSaveOrganizationSettings(organizationId: string | null) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (dto: SaveOrganizationSettingsRequestDTO) => {
      if (!organizationId) throw new Error('Organization ID is required')
      const response = await organizationService.saveSettings(organizationId, dto)
      return mapOrganizationSettingsResponseToOrganizationSettings(response.data.data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ORGANIZATION_SETTINGS_QUERY_KEY, organizationId] })
    },
  })
}
