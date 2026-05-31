import { useState, useMemo, useCallback } from 'react'
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useReportsStore } from '../store/reportsStore'
import { useAuthStore } from '@/shared/store/authStore'
import { useWorkSessionSummary } from '../hooks/useReports'
import { usePlaces } from '@/features/places/hooks/usePlaces'
import { LoadingSpinner } from './LoadingSpinner'
import {
  getMonthDays,
  getHeatmapColor,
  formatMonthYear,
  formatDayLabel,
  formatDateISO,
} from '../utils/calendar-helpers'
import { formatDuration } from '@/shared/utils/time-formatters'
import type { WorkSessionSummary } from '../../models/work-session-summary.model'

export function CalendarGrid() {
  const { t } = useTranslation('auth')
  const { calendarFilters, setCalendarFilters } = useReportsStore()
  const selectedOrganizationId = useAuthStore((s) => s.selectedOrganizationId)

  const { data: places } = usePlaces(selectedOrganizationId || '')

  const [year, month] = useMemo(() => {
    const [y, m] = calendarFilters.month.split('-').map(Number)
    return [y, m - 1]
  }, [calendarFilters.month])

  const currentMonthDate = useMemo(() => new Date(year, month), [year, month])
  const calendarDays = useMemo(() => getMonthDays(year, month), [year, month])

  const monthStart = useMemo(() => {
    const d = new Date(year, month, 1)
    return d.toISOString()
  }, [year, month])

  const monthEnd = useMemo(() => {
    const d = new Date(year, month + 1, 0, 23, 59, 59)
    return d.toISOString()
  }, [year, month])

  const summaryParams = useMemo(
    () => ({
      placeId: calendarFilters.placeId || undefined,
      organizationId: calendarFilters.placeId ? undefined : selectedOrganizationId || undefined,
      range: 'CUSTOM' as const,
      groupBy: 'DAY' as const,
      startDate: monthStart,
      endDate: monthEnd,
    }),
    [calendarFilters.placeId, selectedOrganizationId, monthStart, monthEnd]
  )

  const { data: summary, isLoading, error } = useWorkSessionSummary(summaryParams)

  const dayDataMap = useMemo(() => {
    const map = new Map<string, { minutes: number; sessions: number; pay: number }>()
    if (!summary) return map
    summary.summaryBlocks.forEach((block) => {
      map.set(block.periodLabel, {
        minutes: block.totalMinutes,
        sessions: block.totalSessions,
        pay: block.totalPay,
      })
    })
    return map
  }, [summary])

  const maxMinutes = useMemo(() => {
    if (!dayDataMap.size) return 0
    return Math.max(...Array.from(dayDataMap.values()).map((d) => d.minutes))
  }, [dayDataMap])

  const [selectedDay, setSelectedDay] = useState<Date | null>(() => {
    const today = new Date()
    if (today.getFullYear() === year && today.getMonth() === month) {
      return today
    }
    return null
  })

  const handlePrevMonth = useCallback(() => {
    const newDate = new Date(year, month - 1)
    const newMonthStr = `${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, '0')}`
    setCalendarFilters({ month: newMonthStr })
    setSelectedDay(null)
  }, [year, month, setCalendarFilters])

  const handleNextMonth = useCallback(() => {
    const newDate = new Date(year, month + 1)
    const newMonthStr = `${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, '0')}`
    setCalendarFilters({ month: newMonthStr })
    setSelectedDay(null)
  }, [year, month, setCalendarFilters])

  const handlePlaceChange = (placeId: string | null) => {
    setCalendarFilters({ placeId })
  }

  const handleDayClick = (day: { date: Date; isCurrentMonth: boolean }) => {
    if (!day.isCurrentMonth) {
      const newMonthStr = `${day.date.getFullYear()}-${String(day.date.getMonth() + 1).padStart(2, '0')}`
      setCalendarFilters({ month: newMonthStr })
    }
    setSelectedDay(day.date)
  }

  const weekdayHeaders = useMemo(() => {
    const headers = []
    for (let i = 0; i < 7; i++) {
      const d = new Date(2024, 0, i)
      headers.push(formatDayLabel(d))
    }
    return headers
  }, [])

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="p-2 rounded-lg hover:bg-muted/50 transition-colors"
            aria-label={t('calendar.prevMonth')}
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <h2 className="text-xl font-semibold text-foreground min-w-[200px] text-center">
            {formatMonthYear(currentMonthDate)}
          </h2>
          <button
            type="button"
            onClick={handleNextMonth}
            className="p-2 rounded-lg hover:bg-muted/50 transition-colors"
            aria-label={t('calendar.nextMonth')}
          >
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>
        </div>

        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <select
            value={calendarFilters.placeId || ''}
            onChange={(e) => handlePlaceChange(e.target.value || null)}
            className="h-[var(--input-height-md)] bg-input/30 border border-border rounded-lg text-foreground pl-10 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all text-sm"
          >
            <option value="">{t('calendar.allPlaces')}</option>
            {places?.map((place) => (
              <option key={place.id} value={place.id}>
                {place.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-destructive text-sm mb-4">
          {t('calendar.error')}
        </div>
      )}

      {isLoading && <LoadingSpinner label={t('calendar.loading')} />}

      {!isLoading && (
        <>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekdayHeaders.map((day) => (
              <div key={day} className="text-center text-xs font-medium text-muted-foreground uppercase tracking-wider py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => {
              const dateKey = formatDateISO(day.date)
              const data = dayDataMap.get(dateKey)
              const intensity = maxMinutes > 0 && data ? data.minutes / maxMinutes : 0
              const isSelected = selectedDay && formatDateISO(selectedDay) === dateKey

              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleDayClick(day)}
                  className={`
                    relative aspect-square rounded-lg p-2 flex flex-col items-start justify-start
                    transition-all text-left
                    ${day.isCurrentMonth ? 'text-foreground' : 'text-muted-foreground/50'}
                    ${getHeatmapColor(intensity)}
                    ${isSelected ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}
                    ${day.isToday && !isSelected ? 'ring-2 ring-primary/30' : ''}
                  `}
                >
                  <span className={`text-sm font-medium ${day.isToday ? 'text-primary' : ''}`}>
                    {day.dayOfMonth}
                  </span>
                  {data && data.minutes > 0 && (
                    <span className={`text-xs mt-auto font-medium ${intensity > 0.5 ? 'text-primary-foreground' : 'text-primary'}`}>
                      {formatDuration(data.minutes)}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          <div className="flex items-center justify-center gap-3 mt-4 pt-4 border-t border-border">
            <span className="text-xs text-muted-foreground">{t('calendar.lessActivity')}</span>
            <div className="flex gap-1">
              {[0, 0.25, 0.5, 0.75, 1].map((level) => (
                <div key={level} className={`w-4 h-4 rounded ${getHeatmapColor(level)}`} />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">{t('calendar.moreActivity')}</span>
          </div>
        </>
      )}
    </div>
  )
}
