import { useTranslation } from 'react-i18next'
import { Search, MapPin } from 'lucide-react'
import { PlaceSelect } from '@/shared/components/PlaceSelect'
import { useHourlyRateStore } from '../store/hourlyRateStore'
import type { Place } from '@/features/places/models/place.model'

interface HourlyRatesFiltersProps {
  places: Place[] | undefined
  isPlacesLoading: boolean
}

export function HourlyRatesFilters({ places, isPlacesLoading }: HourlyRatesFiltersProps) {
  const { t } = useTranslation('auth')
  const { selectedPlaceId, tabFilter, searchQuery, setSelectedPlaceId, setTabFilter, setSearchQuery } =
    useHourlyRateStore()

  const tabs = [
    { key: 'ALL' as const, label: t('hourlyRates.tabs.all') },
    { key: 'WITH_RATE' as const, label: t('hourlyRates.tabs.withRate') },
    { key: 'NO_RATE' as const, label: t('hourlyRates.tabs.noRate') },
  ]

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
        <div className="w-full sm:w-72">
          <PlaceSelect
            label={t('hourlyRates.placeLabel')}
            placeholder={t('hourlyRates.placePlaceholder')}
            value={selectedPlaceId ?? ''}
            onChange={(value) => setSelectedPlaceId(value || null)}
            options={(places ?? []).map((p) => ({ id: p.id, name: p.name }))}
            disabled={isPlacesLoading}
            icon={<MapPin className="w-5 h-5" />}
          />
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('hourlyRates.searchPlaceholder')}
            className="w-full h-[var(--input-height-md)] pl-10 pr-4 bg-input/30 border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
          />
        </div>
      </div>

      <div className="flex gap-2">
        {tabs.map((tab) => {
          const isActive = tabFilter === tab.key
          return (
            <button
              key={tab.key}
              onClick={() => setTabFilter(tab.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
