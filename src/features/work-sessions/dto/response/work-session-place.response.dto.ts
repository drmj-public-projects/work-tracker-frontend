export interface WorkSessionPlaceResponseDTO {
  id: string
  userId: string
  organizationId: string
  placeId: string
  placeName: string
  placeLatitude?: number
  placeLongitude?: number
  placeRadiusMeters?: number
  startTime: string
  endTime?: string
  durationMinutes?: number
  breakMinutes: number
  hourlyRate: number
  totalPay: number
  notes?: string
  status: string
  entryType: string
  source: string
}