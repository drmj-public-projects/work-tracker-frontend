import { useTranslation } from 'react-i18next'
import { Calendar, ChevronDown } from 'lucide-react'
import { useReportsStore, type ReportRange, type ReportStatus } from '../store/reportsStore'

const RANGE_OPTIONS: { value: ReportRange; labelKey: string }[] = [
  { value: 'THIS_WEEK', labelKey: 'thisWeek' },
  { value: 'LAST_WEEK', labelKey: 'lastWeek' },
  { value: 'THIS_MONTH', labelKey: 'thisMonth' },
  { value: 'LAST_MONTH', labelKey: 'lastMonth' },
  { value: 'CUSTOM', labelKey: 'custom' },
]

const STATUS_OPTIONS: { value: ReportStatus | null; labelKey: string; color: string }[] = [
  { value: null, labelKey: 'all', color: 'bg-primary text-primary-foreground' },
  { value: 'COMPLETED', labelKey: 'completed', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
  { value: 'PENDING', labelKey: 'pending', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  { value: 'ACTIVE', labelKey: 'active', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  { value: 'REJECTED', labelKey: 'rejected', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
]

const ROWS_OPTIONS = [10, 20, 50, 100]

export function HistoryFilters() {
  const { t } = useTranslation('auth')
  const { historyFilters, setHistoryFilters } = useReportsStore()

  const handleRangeChange = (range: ReportRange) => {
    setHistoryFilters({ range, startDate: null, endDate: null, page: 0 })
  }

  const handleStatusChange = (status: ReportStatus | null) => {
    if (status === null) {
      setHistoryFilters({ status: [], page: 0 })
    } else {
      setHistoryFilters({ status: [status], page: 0 })
    }
  }

  const handleRowsChange = (size: number) => {
    setHistoryFilters({ size, page: 0 })
  }

  const currentStatus = historyFilters.status.length === 1 ? historyFilters.status[0] : null

  return (
    <div className="bg-card border border-border rounded-xl p-4 flex flex-wrap items-center gap-4">
      {/* Range */}
      <div className="relative">
        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <select
          value={historyFilters.range}
          onChange={(e) => handleRangeChange(e.target.value as ReportRange)}
          className="h-[var(--input-height-md)] bg-input/30 border border-border rounded-lg text-foreground pl-10 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all text-sm"
        >
          {RANGE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {t(`history.ranges.${opt.labelKey}`)}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
      </div>

      {/* Status */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {t('history.statusLabel')}
        </span>
        <div className="flex gap-1.5">
          {STATUS_OPTIONS.map((opt) => {
            const isActive =
              opt.value === null
                ? historyFilters.status.length === 0
                : currentStatus === opt.value

            return (
              <button
                key={opt.labelKey}
                type="button"
                onClick={() => handleStatusChange(opt.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                  isActive
                    ? opt.color + ' border-transparent'
                    : 'bg-input/30 text-muted-foreground border-border hover:bg-input/50'
                }`}
              >
                {t(`history.statusOptions.${opt.labelKey}`)}
              </button>
            )
          })}
        </div>
      </div>

      {/* Rows per page */}
      <div className="flex items-center gap-2 ml-auto">
        <span className="text-xs text-muted-foreground">{t('history.rows')}</span>
        <select
          value={historyFilters.size}
          onChange={(e) => handleRowsChange(Number(e.target.value))}
          className="h-8 w-14 bg-input/30 border border-border rounded-lg text-foreground text-center appearance-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all text-sm"
        >
          {ROWS_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
