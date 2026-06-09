import { useMemo } from 'react'
import { useAuthStore } from '@/shared/store/authStore'
import {
  formatDateInTimeZone,
  formatTimeInTimeZone,
  formatTimeRangeInTimeZone,
  formatDateShortInTimeZone,
  formatDateTimeInTimeZone,
  toISOStringWithTimeZone,
} from '@/shared/utils/time-formatters'

export function useFormattedDate() {
  const timeZone = useAuthStore((state) => state.organizationSettings?.timeZone) ?? 'UTC'

  return useMemo(
    () => ({
      timeZone,
      formatDate: (dateStr: string) => formatDateInTimeZone(dateStr, timeZone),
      formatTime: (dateStr: string) => formatTimeInTimeZone(dateStr, timeZone),
      formatTimeRange: (startTime: string, endTime?: string) =>
        formatTimeRangeInTimeZone(startTime, endTime, timeZone),
      formatDateShort: (dateStr: string) => formatDateShortInTimeZone(dateStr, timeZone),
      formatDateTime: (dateStr: string) => formatDateTimeInTimeZone(dateStr, timeZone),
      toISOString: (dateStr: string) => toISOStringWithTimeZone(dateStr, timeZone),
    }),
    [timeZone]
  )
}
