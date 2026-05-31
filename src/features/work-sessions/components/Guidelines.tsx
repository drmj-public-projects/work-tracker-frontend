import { CheckCircle2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function Guidelines() {
  const { t } = useTranslation('auth')

  const items = [
    t('manualEntry.guideline1'),
    t('manualEntry.guideline2'),
    t('manualEntry.guideline3'),
  ]

  return (
    <div className="bg-card rounded-2xl border border-border p-6">
      <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
        {t('manualEntry.guidelines')}
      </h3>
      <ul className="space-y-3">
        {items.map((text, i) => (
          <li
            key={i}
            className="flex items-start gap-3 text-sm text-muted-foreground"
          >
            <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
            <span>{text}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
