import { useTranslation } from 'react-i18next'
import { Plus } from 'lucide-react'

interface CreatePlaceCardProps {
  onClick?: () => void
}

export function CreatePlaceCard({ onClick }: CreatePlaceCardProps) {
  const { t } = useTranslation('auth')

  return (
    <button
      type="button"
      onClick={onClick}
      className="bg-card rounded-2xl border border-dashed border-border p-6 hover:border-primary hover:bg-primary/5 transition-all flex flex-col items-center justify-center text-center min-h-[280px]"
    >
      <div className="w-14 h-14 bg-muted rounded-full flex items-center justify-center mb-4">
        <Plus className="w-7 h-7 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">
        {t('places.createNew')}
      </h3>
      <p className="text-sm text-muted-foreground max-w-[200px]">
        {t('places.createDescription')}
      </p>
    </button>
  )
}
