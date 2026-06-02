import { apiService } from '@/shared/services'
import type { ApiResponse } from '@/shared/types/api-response.type'
import type { WorkSessionSummaryResponseDTO } from '../dto/response/work-session-summary.response.dto'
import type { WorkSessionDetailResponseDTO } from '../dto/response/work-session-detail.response.dto'
import type { AxiosResponse } from 'axios'

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

function buildQueryString<T extends object>(params: T): string {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return
    if (Array.isArray(value)) {
      value.forEach((v) => searchParams.append(key, String(v)))
    } else {
      searchParams.append(key, String(value))
    }
  })
  const query = searchParams.toString()
  return query ? `?${query}` : ''
}

export const reportService = {
  getSummary: (
    params: SummaryQueryParams
  ): Promise<AxiosResponse<ApiResponse<WorkSessionSummaryResponseDTO>>> =>
    apiService.get<ApiResponse<WorkSessionSummaryResponseDTO>>(
      `/workSessions/summary${buildQueryString(params)}`
    ),

  getDetail: (
    params: DetailQueryParams
  ): Promise<AxiosResponse<ApiResponse<WorkSessionDetailResponseDTO>>> =>
    apiService.get<ApiResponse<WorkSessionDetailResponseDTO>>(
      `/workSessions${buildQueryString(params)}`
    ),
}
