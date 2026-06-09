import type { OrganizationSettingsResponseDTO } from '../dto/response/organization-settings.response.dto'
import type { OrganizationSettings } from '../models/organization-settings.model'

function toBoolean(value: unknown): boolean {
  if (typeof value === 'boolean') return value
  if (typeof value === 'string') return value.toLowerCase() === 'true'
  return false
}

export function mapOrganizationSettingsResponseToOrganizationSettings(
  dto: OrganizationSettingsResponseDTO
): OrganizationSettings {
  return {
    id: dto.id,
    organizationId: dto.organizationId,
    requireLocation: toBoolean(
      dto.requireLocation
    ),
    allowManualEntries: toBoolean(
      dto.allowManualEntries
    ),
    allowEditAfterSubmit: toBoolean(
      dto.allowEditAfterSubmit
    ),
    timeZone: dto.timeZone || 'UTC',
  }
}
