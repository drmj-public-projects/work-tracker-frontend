import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { CalendarDays, Clock, Plus } from 'lucide-react'
import { useWorkSessionDetail } from '../hooks/useReports'
import { useAuthStore } from '@/shared/store/authStore'
import { useReportsStore } from '../store/reportsStore'
import { formatTimeRange, formatDuration } from '@/shared/utils/time-formatters'
import type { WorkSession } from '@/features/work-sessions/models/work-session.model'

interface DayDetailPanelProps {
  selectedDay: Date | null
}

export function DayDetailPanel({ selectedDay }: DayDetailPanelProps) {
  const { t } = useTranslation('auth')
  const selectedOrganizationId = useAuthStore((s) => s.selectedOrganizationId)
  const { calendarFilters } = useReportsStore()

  const detailParams = useMemo(() => {
    if (!selectedDay) return null
    const start = new Date(selectedDay)
    start.setHours(0, 0, 0, 0)
    const end = new Date(selectedDay)
    end.setHours(23, 59, 59, 999)

    return {
      placeId: calendarFilters.placeId || undefined,
      organizationId: calendarFilters.placeId ? undefined : selectedOrganizationId || undefined,
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      page: 0,
      size: 100,
    }
  }, [selectedDay, calendarFilters.placeId, selectedOrganizationId])

  const { data: dayDetail, isLoading } = useWorkSessionDetail(detailParams || {})
  const sessions = dayDetail?.sessions ?? []

  const formattedDate = selectedDay
    ? selectedDay.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : ''

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">
          {selectedDay
            ? t('calendar.sessionsFor', { date: formattedDate })
            : t('calendar.selectDay')}
        </h3>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
        </div>
      )}

      {!isLoading && selectedDay && (
        <>
          {sessions.length === 0 ? (
            <div className="text-center py-8">
              <CalendarDays className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">{t('calendar.noSessions')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sessions.map((session: WorkSession) => (
                <div key={session.id} className="border border-border rounded-lg p-4 hover:bg-muted/30 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm font-medium text-primary">
                        {formatTimeRange(session.startTime, session.endTime)}
                      </p>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${
                        session.status === 'COMPLETED'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                          : session.status === 'ACTIVE'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                            : session.status === 'PENDING'
                              ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                              : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {session.status}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-foreground">
                      ${session.totalPay.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-sm text-foreground font-medium">
                    {session.place.name || t('calendar.unknownPlace')}
                  </p>
                  {session.notes && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{session.notes}</p>
                  )}
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDuration(session.durationMinutes || 0)}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className={`w-2 h-2 rounded-full ${session.entryType === 'TIMER' ? 'bg-primary' : 'bg-primary/40'}`} />
                      {session.entryType === 'TIMER' ? t('calendar.timerEntry') : t('calendar.manualEntry')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {!selectedDay && !isLoading && (
        <div className="text-center py-8">
          <CalendarDays className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">{t('calendar.selectDayPrompt')}</p>
        </div>
      )}

      <button
        type="button"
        className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 border border-dashed border-border rounded-lg text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors text-sm font-medium disabled:opacity-50"
        disabled
      >
        <Plus className="w-4 h-4" />
        {t('calendar.manualEntry')}
      </button>
    </div>
  )
}
