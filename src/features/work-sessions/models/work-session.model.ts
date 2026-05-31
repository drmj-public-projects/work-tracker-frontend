export interface WorkSessionPlaceInfo {
  id: string
  name: string
  description?: string
}

export interface WorkSession {
  id: string
  userId: string
  organizationId: string
  place: WorkSessionPlaceInfo
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