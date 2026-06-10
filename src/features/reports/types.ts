export interface TrendDataPoint {
  periodLabel: string
  earnings: number
  hours: number
}

export interface BreakdownDataPoint {
  name: string
  value: number
  color: string
}

export interface ComparisonDataPoint {
  periodLabel: string
  current: number
  previous: number
}

export interface SummaryQueryParams {
  placeId?: string
  organizationId?: string
  range: string
  groupBy?: string
  status?: string[]
  startDate?: string
  endDate?: string
}

export interface DetailQueryParams {
  placeId?: string
  organizationId?: string
  range?: string
  startDate?: string
  endDate?: string
  status?: string[]
  page?: number
  size?: number
}
