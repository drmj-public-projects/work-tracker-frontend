export interface OrganizationSettings {
  id: string;
  organizationId: string;
  requireLocation: boolean;
  allowManualEntries: boolean;
  allowEditAfterSubmit: boolean;
  timeZone: string;
}
