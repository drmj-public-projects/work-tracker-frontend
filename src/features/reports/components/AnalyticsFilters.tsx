import { useTranslation } from 'react-i18next'
import { Calendar, ChevronDown, MapPin, X } from 'lucide-react'
import { useReportsStore, type ReportRange, type ReportGroupBy, type ReportStatus } from '../store/reportsStore'
import type { Place } from '@/features/places/models/place.model'

const RANGE_OPTIONS: { value: ReportRange; labelKey: string }[] = [
  { value: 'THIS_WEEK', labelKey: 'thisWeek' },
  { value: 'LAST_WEEK', labelKey: 'lastWeek' },
  { value: 'THIS_MONTH', labelKey: 'thisMonth' },
  { value: 'LAST_MONTH', labelKey: 'lastMonth' },
  { value: 'CUSTOM', labelKey: 'custom' },
]

const GROUP_BY_OPTIONS: { value: ReportGroupBy; labelKey: string }[] = [
  { value: 'DAY', labelKey: 'day' },
  { value: 'WEEK', labelKey: 'week' },
  { value: 'MONTH', labelKey: 'month' },
]

const STATUS_OPTIONS: { value: ReportStatus; labelKey: string; color: string }[] = [
  { value: 'ACTIVE', labelKey: 'active', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
  { value: 'COMPLETED', labelKey: 'completed', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  { value: 'PENDING', labelKey: 'pending', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  { value: 'REJECTED', labelKey: 'rejected', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
]

interface AnalyticsFiltersProps {
  places: Place[] | undefined
}

export function AnalyticsFilters({ places }: AnalyticsFiltersProps) {
  const { t } = useTranslation('auth')
  const { analyticsFilters, setAnalyticsFilters } = useReportsStore()

  const handleRangeChange = (range: ReportRange) => {
    setAnalyticsFilters({ range, startDate: null, endDate: null })
  }

  const handleGroupByChange = (groupBy: ReportGroupBy) => {
    setAnalyticsFilters({ groupBy })
  }

  const handlePlaceChange = (placeId: string | null) => {
    setAnalyticsFilters({ placeId })
  }

  const handleStatusToggle = (status: ReportStatus) => {
    const current = analyticsFilters.status
    const updated = current.includes(status)
      ? current.filter((s) => s !== status)
      : [...current, status]
    setAnalyticsFilters({ status: updated })
  }

  const handleRemoveStatus = (status: ReportStatus) => {
    setAnalyticsFilters({
      status: analyticsFilters.status.filter((s) => s !== status),
    })
  }

  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Location */}
        <div>
          <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            {t('analytics.location')}
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <select
              value={analyticsFilters.placeId || ''}
              onChange={(e) => handlePlaceChange(e.target.value || null)}
              className="w-full h-[var(--input-height-md)] bg-input/30 border border-border rounded-lg text-foreground pl-10 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
            >
              <option value="">{t('analytics.allPlaces')}</option>
              {places?.map((place) => (
                <option key={place.id} value={place.id}>
                  {place.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        {/* Time Range */}
        <div>
          <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            {t('analytics.timeRange')}
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <select
              value={analyticsFilters.range}
              onChange={(e) => handleRangeChange(e.target.value as ReportRange)}
              className="w-full h-[var(--input-height-md)] bg-input/30 border border-border rounded-lg text-foreground pl-10 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
            >
              {RANGE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {t(`analytics.ranges.${opt.labelKey}`)}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        {/* Group By */}
        <div>
          <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            {t('analytics.groupBy')}
          </label>
          <div className="flex rounded-lg border border-border overflow-hidden h-[var(--input-height-md)]">
            {GROUP_BY_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleGroupByChange(opt.value)}
                className={`flex-1 px-3 text-sm font-medium transition-colors ${
                  analyticsFilters.groupBy === opt.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-input/30 text-muted-foreground hover:bg-input/50'
                }`}
              >
                {t(`analytics.groupByOptions.${opt.labelKey}`)}
              </button>
            ))}
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            {t('analytics.status')}
          </label>
          <div className="flex flex-wrap gap-2">
            {STATUS_OPTIONS.map((opt) => {
              const isActive = analyticsFilters.status.includes(opt.value)
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleStatusToggle(opt.value)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all border ${
                    isActive
                      ? opt.color + ' border-transparent'
                      : 'bg-input/30 text-muted-foreground border-border hover:bg-input/50'
                  }`}
                >
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
                  {t(`analytics.statusOptions.${opt.labelKey}`)}
                  {isActive && (
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemoveStatus(opt.value)
                      }}
                    />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
