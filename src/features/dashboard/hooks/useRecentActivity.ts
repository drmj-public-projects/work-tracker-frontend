import { useMemo } from 'react'
import { useWorkSessionDetail } from '@/features/reports/hooks/useReports'

export function useRecentActivity(organizationId: string | null) {
  const thirtyDaysAgo = useMemo(() => {
    const d = new Date()
    d.setDate(d.getDate() - 30)
    d.setHours(0, 0, 0, 0)
    return d.toISOString()
  }, [])

  const todayEnd = useMemo(() => {
    const d = new Date()
    d.setHours(23, 59, 59, 999)
    return d.toISOString()
  }, [])

  const params = useMemo(
    () => ({
      organizationId: organizationId || undefined,
      startDate: thirtyDaysAgo,
      endDate: todayEnd,
      size: 5,
      page: 0,
    }),
    [organizationId, thirtyDaysAgo, todayEnd]
  )

  return useWorkSessionDetail(params)
}
