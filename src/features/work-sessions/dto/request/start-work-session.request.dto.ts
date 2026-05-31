export interface StartWorkSessionRequestDTO {
  userId: string
  organizationId: string
  placeId: string
  breakMinutes: number
  latitude?: number
  longitude?: number
  notes?: string
}