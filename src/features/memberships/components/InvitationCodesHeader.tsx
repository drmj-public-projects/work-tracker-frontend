import { useTranslation } from 'react-i18next'
import { Plus, Ticket } from 'lucide-react'

interface InvitationCodesHeaderProps {
  onGenerateClick: () => void
}

export function InvitationCodesHeader({ onGenerateClick }: InvitationCodesHeaderProps) {
  const { t } = useTranslation('auth')

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Ticket className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            {t('invitationCodes.title')}
          </h1>
        </div>
        <p className="text-muted-foreground">{t('invitationCodes.subtitle')}</p>
      </div>
      <button
        type="button"
        onClick={onGenerateClick}
        className="h-[var(--button-height-md)] px-5 rounded-lg font-medium text-sm bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-active transition-all flex items-center gap-2 shrink-0"
      >
        <Plus className="w-4 h-4" />
        {t('invitationCodes.generateNew')}
      </button>
    </div>
  )
}
