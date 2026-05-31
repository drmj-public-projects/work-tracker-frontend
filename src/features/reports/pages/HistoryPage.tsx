import { useTranslation } from 'react-i18next'
import { Download, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '@/shared/store/authStore'
import { useWorkSessionDetail } from '../hooks/useReports'
import { HistoryFilters } from '../components/HistoryFilters'
import { HistoryTable } from '../components/HistoryTable'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { Pagination } from '@/shared/components/Pagination'
import { useReportsStore } from '../store/reportsStore'
import { useMemo, useCallback } from 'react'

export function HistoryPage() {
  const { t } = useTranslation('auth')
  const selectedOrganizationId = useAuthStore((s) => s.selectedOrganizationId)
  const { historyFilters, setHistoryFilters } = useReportsStore()

  const detailParams = useMemo(
    () => ({
      placeId: historyFilters.placeId || undefined,
      organizationId: historyFilters.placeId ? undefined : selectedOrganizationId || undefined,
      range: historyFilters.range,
      status: historyFilters.status.length > 0 ? historyFilters.status : undefined,
      startDate: historyFilters.startDate || undefined,
      endDate: historyFilters.endDate || undefined,
      page: historyFilters.page,
      size: historyFilters.size,
    }),
    [historyFilters, selectedOrganizationId]
  )

  const { data: detailPage, isLoading, error } = useWorkSessionDetail(detailParams)

  const handlePageChange = useCallback(
    (page: number) => {
      setHistoryFilters({ page })
    },
    [setHistoryFilters]
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('history.title')}</h1>
          <p className="text-muted-foreground mt-1">{t('history.subtitle')}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2.5 h-[var(--button-height-md)] bg-input/30 border border-border text-foreground rounded-lg font-medium hover:bg-input/50 transition-colors disabled:opacity-50"
            disabled
            title={t('history.exportCSV')}
          >
            <Download className="w-4 h-4" />
            {t('history.exportCSV')}
          </button>
          <Link
            to="/work-sessions/manual"
            className="inline-flex items-center gap-2 px-4 py-2.5 h-[var(--button-height-md)] bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            {t('history.newLog')}
          </Link>
        </div>
      </div>

      <HistoryFilters />

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 text-destructive text-sm">
          {t('history.error')}
        </div>
      )}

      {isLoading && <LoadingSpinner label={t('history.loading')} />}

      {!isLoading && !error && detailPage && (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <HistoryTable sessions={detailPage.sessions} />

          {detailPage.totalElements > 0 && (
            <div className="border-t border-border px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">
                {t('history.showing', {
                  from: detailPage.number * detailPage.size + 1,
                  to: Math.min((detailPage.number + 1) * detailPage.size, detailPage.totalElements),
                  total: detailPage.totalElements,
                })}
              </p>
              <Pagination
                currentPage={detailPage.number}
                totalPages={detailPage.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
