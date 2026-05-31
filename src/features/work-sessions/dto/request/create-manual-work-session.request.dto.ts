export interface CreateManualWorkSessionRequestDTO {
  userId: string
  organizationId: string
  placeId: string
  startTime: string
  endTime: string
  breakMinutes: number
  notes?: string
  latitude?: number
  longitude?: number
}
