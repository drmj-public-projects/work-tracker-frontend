import { useTranslation } from 'react-i18next'
import { formatMinutesToHours, getWeekProgress } from '@/shared/utils/time-formatters'

interface WeekSummaryCardProps {
  weeklyTotalMinutes: number
}

export function WeekSummaryCard({ weeklyTotalMinutes }: WeekSummaryCardProps) {
  const { t } = useTranslation('auth')
  const weekProgress = getWeekProgress()

  return (
    <div className="bg-primary text-primary-foreground rounded-xl p-6 flex flex-col justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider opacity-80">
          {t('dashboard.totalThisWeek')}
        </p>
        <p className="text-4xl font-bold mt-2">
          {formatMinutesToHours(weeklyTotalMinutes)}
        </p>
      </div>
      <div className="mt-4">
        <div className="h-2 bg-primary-foreground/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-foreground rounded-full transition-all duration-500"
            style={{ width: `${weekProgress.percentage}%` }}
          />
        </div>
        <p className="text-sm mt-2 opacity-80">
          {weekProgress.percentage}% — {weekProgress.dayName}
        </p>
      </div>
    </div>
  )
}
