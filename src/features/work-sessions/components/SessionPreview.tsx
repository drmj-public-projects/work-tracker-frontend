import { Clock } from 'lucide-react'
import { useTranslation } from 'react-i18next'

function formatDurationMinutes(minutes: number) {
  const h = Math.floor(minutes / 60)
  const m = Math.round(minutes % 60)
  return `${h}h ${m}m`
}

interface SessionPreviewProps {
  grossMinutes?: number | null
  breakMinutes: number
  netMinutes?: number | null
}

export function SessionPreview({
  grossMinutes,
  breakMinutes,
  netMinutes,
}: SessionPreviewProps) {
  const { t } = useTranslation('auth')

  return (
    <div className="bg-card rounded-2xl border border-border p-6">
      <h3 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
        <Clock className="w-5 h-5" />
        {t('manualEntry.sessionPreview')}
      </h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {t('manualEntry.grossDuration')}
          </span>
          <span className="text-sm font-semibold text-foreground">
            {grossMinutes != null ? formatDurationMinutes(grossMinutes) : '0h 0m'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {t('manualEntry.breakTime')}
          </span>
          <span className="text-sm font-semibold text-destructive">
            {breakMinutes > 0
              ? `-${formatDurationMinutes(breakMinutes)}`
              : '0m'}
          </span>
        </div>
        <div className="pt-3 border-t border-border flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">
            {t('manualEntry.netWorkHours')}
          </span>
          <span className="text-lg font-bold text-primary">
            {netMinutes != null
              ? `${(netMinutes / 60).toFixed(1)}h`
              : '0.0h'}
          </span>
        </div>
      </div>
    </div>
  )
}
