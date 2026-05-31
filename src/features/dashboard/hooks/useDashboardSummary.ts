import { useMemo } from 'react'
import { useWorkSessionSummary } from '@/features/reports/hooks/useReports'

export function useDashboardSummary(organizationId: string | null) {
  const params = useMemo(
    () => ({
      organizationId: organizationId || undefined,
      range: 'THIS_WEEK' as const,
      groupBy: 'DAY' as const,
    }),
    [organizationId]
  )

  return useWorkSessionSummary(params)
}
