export interface SummaryBlock {
  periodLabel: string
  totalSessions: number
  totalMinutes: number
  totalPay: number
  timerMinutes: number
  timerPay: number
  manualMinutes: number
  manualPay: number
}

export interface WorkSessionSummary {
  placeId: string | null
  placeName: string
  groupBy: string
  range: string
  summaryBlocks: SummaryBlock[]
}
