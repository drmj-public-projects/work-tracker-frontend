export interface WorkSessionResponseDTO {
  id: string
  userId: string
  organizationId: string
  placeId: string
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