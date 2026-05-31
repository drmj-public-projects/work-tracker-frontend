import { useTranslation } from 'react-i18next'
import { formatDate, formatTimeRange, formatDuration, formatCurrency } from '@/shared/utils/time-formatters'
import type { WorkSession } from '@/features/work-sessions/models/work-session.model'

interface HistoryTableProps {
  sessions: WorkSession[]
}

export function HistoryTable({ sessions }: HistoryTableProps) {
  const { t } = useTranslation('auth')

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/30">
            <th className="text-left px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wider text-xs">
              {t('history.colDate')}
            </th>
            <th className="text-left px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wider text-xs">
              {t('history.colStartEnd')}
            </th>
            <th className="text-left px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wider text-xs">
              {t('history.colDuration')}
            </th>
            <th className="text-left px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wider text-xs">
              {t('history.colBreak')}
            </th>
            <th className="text-left px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wider text-xs">
              {t('history.colRate')}
            </th>
            <th className="text-left px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wider text-xs">
              {t('history.colPay')}
            </th>
            <th className="text-left px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wider text-xs">
              {t('history.colStatus')}
            </th>
            <th className="text-left px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wider text-xs">
              {t('history.colEntryType')}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {sessions.length === 0 ? (
            <tr>
              <td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">
                {t('history.noSessions')}
              </td>
            </tr>
          ) : (
            sessions.map((session) => {
              const dateInfo = formatDate(session.startTime)
              const timeRange = formatTimeRange(session.startTime, session.endTime)

              return (
                <tr key={session.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-4">
                    <div className="font-medium text-foreground">{dateInfo.date}</div>
                    <div className="text-xs text-muted-foreground">{dateInfo.day}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-pre-line text-foreground">{timeRange}</td>
                  <td className="px-4 py-4 text-foreground">
                    {formatDuration(session.durationMinutes || 0)}
                  </td>
                  <td className="px-4 py-4 text-foreground">
                    {formatDuration(session.breakMinutes)}
                  </td>
                  <td className="px-4 py-4 text-foreground">
                    {formatCurrency(session.hourlyRate)}
                  </td>
                  <td className="px-4 py-4 font-semibold text-foreground">
                    {formatCurrency(session.totalPay)}
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      session.status === 'COMPLETED'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                        : session.status === 'ACTIVE'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                          : session.status === 'PENDING'
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5" />
                      {session.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                      session.entryType === 'TIMER'
                        ? 'bg-primary/10 text-primary border border-primary/20'
                        : 'bg-muted text-muted-foreground border border-border'
                    }`}>
                      {session.entryType === 'TIMER' ? t('history.autoTrack') : t('history.manual')}
                    </span>
                  </td>
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}
