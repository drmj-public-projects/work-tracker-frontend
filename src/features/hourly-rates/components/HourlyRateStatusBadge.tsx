import { useTranslation } from 'react-i18next'

interface HourlyRateStatusBadgeProps {
  status: 'ACTIVE' | 'EXPIRING_SOON' | 'EXPIRED' | 'NO_RATE'
}

const statusConfig = {
  ACTIVE: {
    key: 'active',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-500',
    border: 'border-emerald-500/20',
  },
  EXPIRING_SOON: {
    key: 'expiringSoon',
    bg: 'bg-amber-500/10',
    text: 'text-amber-500',
    border: 'border-amber-500/20',
  },
  EXPIRED: {
    key: 'noRate',
    bg: 'bg-muted',
    text: 'text-muted-foreground',
    border: 'border-border',
  },
  NO_RATE: {
    key: 'noRate',
    bg: 'bg-muted',
    text: 'text-muted-foreground',
    border: 'border-border',
  },
}

export function HourlyRateStatusBadge({ status }: HourlyRateStatusBadgeProps) {
  const { t } = useTranslation('auth')
  const config = statusConfig[status]

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}
    >
      {t(`hourlyRates.status.${config.key}`)}
    </span>
  )
}
