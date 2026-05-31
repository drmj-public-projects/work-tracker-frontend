import { useTranslation } from 'react-i18next'
import { MapPin, Loader2 } from 'lucide-react'
import { Modal } from '@/shared/components/Modal'

interface EndSessionModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  isPending: boolean
  placeName: string
  breakMinutes: number
  notes: string
}

export function EndSessionModal({
  isOpen,
  onClose,
  onConfirm,
  isPending,
  placeName,
  breakMinutes,
  notes,
}: EndSessionModalProps) {
  const { t } = useTranslation('auth')

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('activeTimer.endModalTitle')}
      description={t('activeTimer.endModalDescription')}
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="h-[var(--button-height-md)] px-5 bg-muted text-muted-foreground rounded-lg font-medium hover:bg-muted/80 transition-all"
          >
            {t('activeTimer.endModalCancel')}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className="h-[var(--button-height-md)] px-5 bg-destructive text-destructive-foreground rounded-lg font-medium hover:bg-destructive/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isPending && (
              <Loader2 className="w-4 h-4 animate-spin" />
            )}
            {t('activeTimer.endModalConfirm')}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">
              {t('activeTimer.place')}
            </p>
            <p className="text-sm font-medium text-foreground">
              {placeName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-4 h-4 flex items-center justify-center text-muted-foreground">
            <span className="text-xs font-bold">MIN</span>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">
              {t('activeTimer.breakMinutesLabel')}
            </p>
            <p className="text-sm font-medium text-foreground">
              {breakMinutes}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-4 h-4 flex items-center justify-center text-muted-foreground mt-0.5">
            <span className="text-xs font-bold">N</span>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">
              {t('activeTimer.notesLabel')}
            </p>
            <p className="text-sm font-medium text-foreground">
              {notes || (
                <span className="text-muted-foreground">
                  {t('activeTimer.notesPlaceholder')}
                </span>
              )}
            </p>
          </div>
        </div>
      </div>
    </Modal>
  )
}
