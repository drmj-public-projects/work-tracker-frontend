export interface OrganizationSettingsResponseDTO {
  id: string
  organizationId: string
  requireLocation: boolean
  allowManualEntries: boolean
  allowEditAfterSubmit: boolean
  timeZone: string
}
