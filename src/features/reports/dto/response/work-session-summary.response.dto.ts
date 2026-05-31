export interface WorkSessionSummaryBlockDTO {
  periodLabel: string
  totalSessions: number
  totalMinutes: number
  totalPay: number
  timerMinutes: number
  timerPay: number
  manualMinutes: number
  manualPay: number
}

export interface WorkSessionSummaryResponseDTO {
  placeId: string | null
  placeName: string
  groupBy: string
  range: string
  summaryBlocks: WorkSessionSummaryBlockDTO[]
}
