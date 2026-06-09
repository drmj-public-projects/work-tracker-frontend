import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ArrowRight, Timer, MapPin } from 'lucide-react'
import { formatMinutesToHours } from '@/shared/utils/time-formatters'
import { useFormattedDate } from '@/shared/hooks/useFormattedDate'
import type { WorkSession } from '@/features/work-sessions/models/work-session.model'

interface RecentActivityListProps {
  sessions: WorkSession[]
}

export function RecentActivityList({ sessions }: RecentActivityListProps) {
  const { t } = useTranslation('auth')
  const { formatDateShort, formatTime } = useFormattedDate()

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="p-5 border-b border-border flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">
          {t('dashboard.recentActivity')}
        </h3>
        <Link
          to="/reports/history"
          className="text-sm font-medium text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1"
        >
          {t('dashboard.viewAllSessions')}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {sessions.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground">
          {t('dashboard.noRecentActivity')}
        </div>
      ) : (
        <div className="divide-y divide-border">
          {sessions.map((session) => {
            const dateLabel = formatDateShort(session.startTime)
            const timeLabel = formatTime(session.startTime)
            const isActive = session.status === 'ACTIVE'

            return (
              <div
                key={session.id}
                className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                    {session.entryType === 'TIMER' ? (
                      <Timer className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <MapPin className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {session.entryType === 'TIMER'
                        ? t('dashboard.sessionAtPlace', { place: session.place.name || t('dashboard.unknownPlace') })
                        : t('dashboard.manualEntryAtPlace', { place: session.place.name || t('dashboard.unknownPlace') })}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {dateLabel}, {timeLabel}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {session.durationMinutes && session.durationMinutes > 0 && (
                    <span className="text-sm font-medium text-foreground">
                      {formatMinutesToHours(session.durationMinutes)}
                    </span>
                  )}
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      isActive
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                        : session.status === 'COMPLETED'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                          : session.status === 'PENDING'
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5" />
                    {t(`history.statusOptions.${session.status.toLowerCase()}` as any)}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
