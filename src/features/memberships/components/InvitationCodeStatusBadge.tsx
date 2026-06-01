import { useTranslation } from 'react-i18next'

export type InvitationCodeStatus = 'active' | 'expired' | 'exhausted'

interface InvitationCodeStatusBadgeProps {
  status: InvitationCodeStatus
}

const STATUS_STYLES: Record<
  InvitationCodeStatus,
  { bg: string; text: string; dot: string }
> = {
  active: {
    bg: 'bg-emerald-100 dark:bg-emerald-900/30',
    text: 'text-emerald-700 dark:text-emerald-400',
    dot: 'bg-emerald-500',
  },
  expired: {
    bg: 'bg-red-100 dark:bg-red-900/30',
    text: 'text-red-700 dark:text-red-400',
    dot: 'bg-red-500',
  },
  exhausted: {
    bg: 'bg-amber-100 dark:bg-amber-900/30',
    text: 'text-amber-700 dark:text-amber-400',
    dot: 'bg-amber-500',
  },
}

export function InvitationCodeStatusBadge({ status }: InvitationCodeStatusBadgeProps) {
  const { t } = useTranslation('auth')
  const styles = STATUS_STYLES[status]

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${styles.bg} ${styles.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${styles.dot} mr-1.5`} />
      {t(`invitationCodes.status.${status}`)}
    </span>
  )
}
