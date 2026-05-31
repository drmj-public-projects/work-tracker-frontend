import { useQuery } from '@tanstack/react-query'
import { reportService } from '../services/report.service'
import {
  mapSummaryResponseDTOToWorkSessionSummary,
  mapDetailResponseDTOToPage,
} from '../mappers/report.mapper'
import type { SummaryQueryParams, DetailQueryParams } from '../services/report.service'

const REPORTS_QUERY_KEY = 'reports'

export function useWorkSessionSummary(params: SummaryQueryParams) {
  return useQuery({
    queryKey: [REPORTS_QUERY_KEY, 'summary', params],
    queryFn: async () => {
      const response = await reportService.getSummary(params)
      return mapSummaryResponseDTOToWorkSessionSummary(response.data.data)
    },
    enabled: !!params.range,
    staleTime: 5 * 60 * 1000,
  })
}

export function useWorkSessionComparison(
  baseParams: SummaryQueryParams,
  compareRange: string
) {
  return useQuery({
    queryKey: [REPORTS_QUERY_KEY, 'comparison', baseParams, compareRange],
    queryFn: async () => {
      const [baseResponse, compareResponse] = await Promise.all([
        reportService.getSummary(baseParams),
        reportService.getSummary({ ...baseParams, range: compareRange }),
      ])
      return {
        base: mapSummaryResponseDTOToWorkSessionSummary(baseResponse.data.data),
        compare: mapSummaryResponseDTOToWorkSessionSummary(compareResponse.data.data),
      }
    },
    enabled: !!baseParams.range && !!compareRange,
    staleTime: 5 * 60 * 1000,
  })
}

export function useWorkSessionDetail(params: DetailQueryParams) {
  return useQuery({
    queryKey: [REPORTS_QUERY_KEY, 'detail', params],
    queryFn: async () => {
      const response = await reportService.getDetail(params)
      return mapDetailResponseDTOToPage(response.data.data)
    },
    enabled: !!params.range || (!!params.startDate && !!params.endDate),
    staleTime: 5 * 60 * 1000,
  })
}
