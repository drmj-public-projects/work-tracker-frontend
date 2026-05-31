import { useTranslation } from 'react-i18next'
import { BarChart3, Clock, DollarSign, Timer } from 'lucide-react'
import { formatMinutesToHours, formatCurrency } from '@/shared/utils/time-formatters'

interface SummaryCardsProps {
  totals: {
    sessions: number
    minutes: number
    pay: number
    timerMinutes: number
    timerPay: number
  } | null
}

export function SummaryCards({ totals }: SummaryCardsProps) {
  const { t } = useTranslation('auth')

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-muted-foreground">{t('analytics.totalSessions')}</span>
          <BarChart3 className="w-5 h-5 text-primary" />
        </div>
        <p className="text-2xl font-bold text-foreground">{totals?.sessions ?? 0}</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-muted-foreground">{t('analytics.totalHours')}</span>
          <Clock className="w-5 h-5 text-primary" />
        </div>
        <p className="text-2xl font-bold text-foreground">
          {formatMinutesToHours(totals?.minutes ?? 0)}
        </p>
      </div>

      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-muted-foreground">{t('analytics.totalEarnings')}</span>
          <DollarSign className="w-5 h-5 text-primary" />
        </div>
        <p className="text-2xl font-bold text-foreground">
          {formatCurrency(totals?.pay ?? 0)}
        </p>
      </div>

      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-muted-foreground">{t('analytics.timerEntry')}</span>
          <Timer className="w-5 h-5 text-primary" />
        </div>
        <p className="text-2xl font-bold text-foreground">
          {formatMinutesToHours(totals?.timerMinutes ?? 0)}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {formatCurrency(totals?.timerPay ?? 0)}
        </p>
      </div>
    </div>
  )
}
