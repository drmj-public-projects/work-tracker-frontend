import { useTranslation } from 'react-i18next'
import { Download } from 'lucide-react'
import { useAuthStore } from '@/shared/store/authStore'
import { useWorkSessionSummary, useWorkSessionComparison } from '../hooks/useReports'
import { usePlaces } from '@/features/places/hooks/usePlaces'
import { useReportsStore } from '../store/reportsStore'
import { useMemo } from 'react'
import { formatCurrency } from '@/shared/utils/time-formatters'
import { AnalyticsFilters } from '../components/AnalyticsFilters'
import { SummaryCards } from '../components/SummaryCards'
import { TrendsChart } from '../components/charts/TrendsChart'
import { BreakdownChart } from '../components/charts/BreakdownChart'
import { ComparisonChart } from '../components/charts/ComparisonChart'
import { LoadingSpinner } from '../components/LoadingSpinner'
import {
  getCompareRange,
  buildTrendsData,
  buildBreakdownData,
  buildComparisonData,
} from '../utils/report-formatters'

export function AnalyticsPage() {
  const { t } = useTranslation('auth')
  const selectedOrganizationId = useAuthStore((s) => s.selectedOrganizationId)
  const { analyticsFilters } = useReportsStore()
  const { data: places } = usePlaces(selectedOrganizationId || '')

  const summaryParams = useMemo(
    () => ({
      placeId: analyticsFilters.placeId || undefined,
      organizationId: analyticsFilters.placeId ? undefined : selectedOrganizationId || undefined,
      range: analyticsFilters.range,
      groupBy: analyticsFilters.groupBy,
      status: analyticsFilters.status.length > 0 ? analyticsFilters.status : undefined,
      startDate: analyticsFilters.startDate || undefined,
      endDate: analyticsFilters.endDate || undefined,
    }),
    [analyticsFilters, selectedOrganizationId]
  )

  const compareRange = getCompareRange(analyticsFilters.range)

  const { data: summary, isLoading: summaryLoading, error: summaryError } = useWorkSessionSummary(summaryParams)
  const { data: comparison, isLoading: comparisonLoading } = useWorkSessionComparison(summaryParams, compareRange || '')

  const totals = useMemo(() => {
    if (!summary?.summaryBlocks.length) return null
    return summary.summaryBlocks.reduce(
      (acc, block) => ({
        sessions: acc.sessions + block.totalSessions,
        minutes: acc.minutes + block.totalMinutes,
        pay: acc.pay + block.totalPay,
        timerMinutes: acc.timerMinutes + block.timerMinutes,
        timerPay: acc.timerPay + block.timerPay,
        manualMinutes: acc.manualMinutes + block.manualMinutes,
        manualPay: acc.manualPay + block.manualPay,
      }),
      { sessions: 0, minutes: 0, pay: 0, timerMinutes: 0, timerPay: 0, manualMinutes: 0, manualPay: 0 }
    )
  }, [summary])

  const trendsData = useMemo(() => buildTrendsData(summary?.summaryBlocks ?? []), [summary])
  const breakdownData = useMemo(() => buildBreakdownData(totals, t), [totals, t])
  const comparisonData = useMemo(
    () => buildComparisonData(summary, comparison?.compare),
    [summary, comparison]
  )

  const isLoading = summaryLoading || comparisonLoading

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('analytics.title')}</h1>
          <p className="text-muted-foreground mt-1">{t('analytics.subtitle')}</p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2.5 h-[var(--button-height-md)] bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          disabled
          title={t('analytics.exportReport')}
        >
          <Download className="w-4 h-4" />
          {t('analytics.exportReport')}
        </button>
      </div>

      <AnalyticsFilters places={places} />

      {isLoading && <LoadingSpinner label={t('analytics.loading')} />}

      {!isLoading && summary && (
        <>
          <SummaryCards totals={totals} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{t('analytics.trendsTitle')}</h3>
                  <p className="text-sm text-muted-foreground">{t('analytics.trendsSubtitle')}</p>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-primary" />
                    {t('analytics.earnings')}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-primary/40" />
                    {t('analytics.hoursWorked')}
                  </span>
                </div>
              </div>
              <TrendsChart data={trendsData} />
            </div>

            <div className="bg-card border border-border rounded-xl p-5">
              <div className="mb-2">
                <h3 className="text-lg font-semibold text-foreground">{t('analytics.breakdownTitle')}</h3>
                <p className="text-sm text-muted-foreground">{t('analytics.breakdownSubtitle')}</p>
              </div>
              <BreakdownChart data={breakdownData} />
              {/* Legend with percentages */}
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-primary" />
                    {t('analytics.timerEntry')}
                  </span>
                  <span className="font-medium">
                    {formatCurrency(totals?.timerPay ?? 0)}
                    {' '}({totals && totals.pay > 0 ? Math.round((totals.timerPay / totals.pay) * 100) : 0}%)
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--chart-3)' }} />
                    {t('analytics.manualEntry')}
                  </span>
                  <span className="font-medium">
                    {formatCurrency(totals?.manualPay ?? 0)}
                    {' '}({totals && totals.pay > 0 ? Math.round((totals.manualPay / totals.pay) * 100) : 0}%)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {compareRange && comparison && (
            <div className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{t('analytics.comparisonTitle')}</h3>
                  <p className="text-sm text-muted-foreground">{t('analytics.comparisonSubtitle')}</p>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-sm bg-primary" />
                    {t('analytics.ranges.thisWeek')}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: 'var(--chart-3)' }} />
                    {t('analytics.ranges.lastWeek')}
                  </span>
                </div>
              </div>
              <ComparisonChart data={comparisonData} />
            </div>
          )}
        </>
      )}
    </div>
  )
}
