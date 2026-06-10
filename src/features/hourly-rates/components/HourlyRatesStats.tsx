import { useTranslation } from 'react-i18next'
import { Users, CheckCircle, AlertTriangle, Clock } from 'lucide-react'
import type { HourlyRateStats } from '../types'

interface HourlyRatesStatsProps {
  stats: HourlyRateStats | undefined
  isLoading: boolean
}

export function HourlyRatesStats({ stats, isLoading }: HourlyRatesStatsProps) {
  const { t } = useTranslation('auth')

  const cards = [
    {
      key: 'totalEmployees',
      label: t('hourlyRates.stats.totalEmployees'),
      value: stats?.totalEmployees ?? 0,
      icon: Users,
      color: 'text-primary',
      border: 'border-l-4 border-l-primary',
    },
    {
      key: 'activeRates',
      label: t('hourlyRates.stats.activeRates'),
      value: stats?.activeRates ?? 0,
      icon: CheckCircle,
      color: 'text-emerald-500',
      border: 'border-l-4 border-l-emerald-500',
    },
    {
      key: 'noRate',
      label: t('hourlyRates.stats.noRate'),
      value: stats?.noRate ?? 0,
      icon: AlertTriangle,
      color: 'text-destructive',
      border: 'border-l-4 border-l-destructive',
    },
    {
      key: 'expiringSoon',
      label: t('hourlyRates.stats.expiringSoon'),
      value: stats?.expiringSoon ?? 0,
      icon: Clock,
      color: 'text-amber-500',
      border: 'border-l-4 border-l-amber-500',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.key}
          className={`bg-card border border-border rounded-xl p-5 shadow-sm ${card.border}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {card.label}
              </p>
              <p className="text-2xl font-bold text-foreground mt-1">
                {isLoading ? '--' : card.value}
              </p>
            </div>
            <card.icon className={`w-8 h-8 ${card.color}`} />
          </div>
        </div>
      ))}
    </div>
  )
}
