import { useTranslation } from 'react-i18next'
import { UserPlus } from 'lucide-react'

interface JoinOrganizationCardProps {
  onClick: () => void
}

export function JoinOrganizationCard({ onClick }: JoinOrganizationCardProps) {
  const { t } = useTranslation('auth')

  return (
    <button
      type="button"
      onClick={onClick}
      className="bg-card rounded-2xl border border-dashed border-border p-6 hover:border-primary hover:bg-primary/5 transition-all flex flex-col items-center justify-center text-center min-h-[200px]"
    >
      <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
        <UserPlus className="w-6 h-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-1">
        {t('joinOrganization.title')}
      </h3>
      <p className="text-sm text-muted-foreground">
        {t('joinOrganization.subtitle')}
      </p>
    </button>
  )
}
