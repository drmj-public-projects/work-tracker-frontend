import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CalendarGrid } from '../components/CalendarGrid'
import { DayDetailPanel } from '../components/DayDetailPanel'

export function CalendarPage() {
  const { t } = useTranslation('auth')
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t('calendar.title')}</h1>
        <p className="text-muted-foreground mt-1">{t('calendar.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CalendarGrid selectedDay={selectedDay} onSelectDay={setSelectedDay} />
        </div>
        <DayDetailPanel selectedDay={selectedDay} />
      </div>
    </div>
  )
}
