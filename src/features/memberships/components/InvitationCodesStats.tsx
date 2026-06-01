import { useTranslation } from 'react-i18next'
import { Ticket, Activity, AlertCircle } from 'lucide-react'
import type { InvitationCodeStats } from '../models/invitation-code-stats.model'

interface InvitationCodesStatsProps {
  stats: InvitationCodeStats | null
}

export function InvitationCodesStats({ stats }: InvitationCodesStatsProps) {
  const { t } = useTranslation('auth')

  const items = [
    {
      label: t('invitationCodes.activeCodes'),
      value: stats?.activeCodes ?? 0,
      icon: Ticket,
      iconColor: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
    },
    {
      label: t('invitationCodes.totalUses'),
      value: stats?.totalUses ?? 0,
      icon: Activity,
      iconColor: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      label: t('invitationCodes.expiredCodes'),
      value: stats?.expiredCodes ?? 0,
      icon: AlertCircle,
      iconColor: 'text-red-500',
      bgColor: 'bg-red-500/10',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      {items.map((item) => (
        <div
          key={item.label}
          className="bg-card border border-border rounded-xl p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {item.label}
            </span>
            <div className={`w-8 h-8 rounded-lg ${item.bgColor} flex items-center justify-center`}>
              <item.icon className={`w-4 h-4 ${item.iconColor}`} />
            </div>
          </div>
          <p className="text-3xl font-bold text-foreground">{item.value}</p>
        </div>
      ))}
    </div>
  )
}
