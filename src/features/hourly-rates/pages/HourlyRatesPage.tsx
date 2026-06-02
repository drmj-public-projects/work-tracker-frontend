import { useState, useMemo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Pencil, Trash2, Plus, MapPin } from 'lucide-react'
import { DataTable, type ColumnDef } from '@/shared/components/DataTable'
import { Pagination } from '@/shared/components/Pagination'
import { usePlaces } from '@/features/places/hooks/usePlaces'
import { useAuthStore } from '@/shared/store/authStore'
import {
  useHourlyRates,
  useHourlyRateStats,
  useCreateHourlyRate,
  useUpdateHourlyRate,
  useDeleteHourlyRate,
} from '../hooks/useHourlyRates'
import { useHourlyRateStore } from '../store/hourlyRateStore'
import { HourlyRatesStats } from '../components/HourlyRatesStats'
import { HourlyRatesFilters } from '../components/HourlyRatesFilters'
import { HourlyRateStatusBadge } from '../components/HourlyRateStatusBadge'
import { AssignRateModal } from '../components/AssignRateModal'
import type { HourlyRateByPlace } from '../mappers/hourly-rate.mapper'
import type { HourlyRateFormData } from '../validation/hourly-rate.schema'

export function HourlyRatesPage() {
  const { t } = useTranslation('auth')
  const organizationId = useAuthStore((s) => s.selectedOrganizationId)
  const { selectedPlaceId, page, pageSize, setPage, tabFilter, searchQuery } =
    useHourlyRateStore()

  const { data: places, isLoading: isPlacesLoading } = usePlaces(organizationId ?? '')
  const { data: rates, isLoading: isRatesLoading } = useHourlyRates(selectedPlaceId)
  const { data: stats } = useHourlyRateStats(selectedPlaceId)

  const createMutation = useCreateHourlyRate()
  const updateMutation = useUpdateHourlyRate(selectedPlaceId)
  const deleteMutation = useDeleteHourlyRate(selectedPlaceId)

  const [modalOpen, setModalOpen] = useState(false)
  const [editingRate, setEditingRate] = useState<HourlyRateByPlace | null>(null)

  const filteredRates = useMemo(() => {
    if (!rates) return []
    let data = [...rates]

    if (tabFilter === 'WITH_RATE') {
      data = data.filter((r) => r.status === 'ACTIVE' || r.status === 'EXPIRING_SOON')
    } else if (tabFilter === 'NO_RATE') {
      data = data.filter((r) => r.status === 'NO_RATE' || r.status === 'EXPIRED')
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      data = data.filter(
        (r) =>
          r.userName.toLowerCase().includes(q) ||
          r.userEmail.toLowerCase().includes(q)
      )
    }

    return data
  }, [rates, tabFilter, searchQuery])

  const totalPages = Math.max(1, Math.ceil(filteredRates.length / pageSize))
  const paginatedRates = useMemo(() => {
    const start = page * pageSize
    return filteredRates.slice(start, start + pageSize)
  }, [filteredRates, page, pageSize])

  const handleOpenEdit = useCallback((rate: HourlyRateByPlace) => {
    setEditingRate(rate)
    setModalOpen(true)
  }, [])

  const handleOpenCreate = useCallback((rate: HourlyRateByPlace) => {
    setEditingRate({ ...rate, rateId: null, rate: null, validFrom: null, validTo: null, status: 'NO_RATE' })
    setModalOpen(true)
  }, [])

  const handleCloseModal = useCallback(() => {
    setModalOpen(false)
    setEditingRate(null)
  }, [])

  const handleSubmit = useCallback(
    (formData: HourlyRateFormData) => {
      if (!selectedPlaceId || !editingRate) return

      if (editingRate.rateId) {
        // Update existing
        updateMutation.mutate({
          id: editingRate.rateId,
          data: {
            rate: formData.rate,
            validFrom: formData.validFrom,
            validTo: formData.validTo ?? null,
          },
        })
      } else {
        // Create new
        createMutation.mutate({
          userId: editingRate.userId,
          placeId: selectedPlaceId,
          rate: formData.rate,
          validFrom: formData.validFrom,
          validTo: formData.validTo ?? null,
        })
      }

      handleCloseModal()
    },
    [selectedPlaceId, editingRate, createMutation, updateMutation, handleCloseModal]
  )

  const handleDelete = useCallback(
    (rate: HourlyRateByPlace) => {
      if (!rate.rateId) return
      if (!window.confirm(t('hourlyRates.deleteConfirm'))) return
      deleteMutation.mutate(rate.rateId)
    },
    [deleteMutation, t]
  )

  const columns: ColumnDef<HourlyRateByPlace>[] = useMemo(
    () => [
      {
        key: 'employee',
        header: t('hourlyRates.colEmployee'),
        cell: (row) => (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
              {row.userName
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')
                .toUpperCase()}
            </div>
            <div>
              <p className="font-medium text-foreground">{row.userName}</p>
              <p className="text-xs text-muted-foreground">{row.userEmail}</p>
            </div>
          </div>
        ),
      },
      {
        key: 'place',
        header: t('hourlyRates.colPlace'),
        cell: (row) => <span className="text-muted-foreground">{row.placeName}</span>,
      },
      {
        key: 'rate',
        header: t('hourlyRates.colRate'),
        cell: (row) =>
          row.rate !== null ? (
            <span className="font-medium text-foreground">
              ${row.rate.toFixed(2)}/hr
            </span>
          ) : (
            <span className="text-muted-foreground italic">N/A</span>
          ),
      },
      {
        key: 'validity',
        header: t('hourlyRates.colValidity'),
        cell: (row) => {
          if (!row.validFrom) return <span className="text-muted-foreground">—</span>
          const from = new Date(row.validFrom).toLocaleDateString()
          if (!row.validTo) {
            return (
              <span className="text-sm text-muted-foreground">
                {from} — {t('hourlyRates.indefinite')}
              </span>
            )
          }
          const to = new Date(row.validTo).toLocaleDateString()
          return (
            <span className="text-sm text-muted-foreground">
              {from} — {to}
            </span>
          )
        },
      },
      {
        key: 'status',
        header: t('hourlyRates.colStatus'),
        cell: (row) => <HourlyRateStatusBadge status={row.status} />,
      },
      {
        key: 'actions',
        header: t('hourlyRates.colActions'),
        className: 'text-right',
        headerClassName: 'text-right',
        cell: (row) => {
          const canAssign = row.status === 'NO_RATE' || row.status === 'EXPIRED'
          return (
            <div className="flex items-center justify-end gap-2">
              {canAssign ? (
                <button
                  onClick={() => handleOpenCreate(row)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  {t('hourlyRates.assign')}
                </button>
              ) : (
                <>
                  <button
                    onClick={() => handleOpenEdit(row)}
                    className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
                    title={t('hourlyRates.edit')}
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(row)}
                    className="p-2 rounded-lg hover:bg-destructive/10 transition-colors text-destructive"
                    title={t('hourlyRates.delete')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          )
        },
      },
    ],
    [t, handleOpenEdit, handleOpenCreate, handleDelete]
  )

  const isLoading = isPlacesLoading || isRatesLoading
  const showingFrom = filteredRates.length > 0 ? page * pageSize + 1 : 0
  const showingTo = Math.min((page + 1) * pageSize, filteredRates.length)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t('hourlyRates.title')}</h1>
        <p className="text-muted-foreground mt-1">{t('hourlyRates.subtitle')}</p>
      </div>

      <HourlyRatesStats stats={stats} isLoading={isRatesLoading} />

      <HourlyRatesFilters places={places} isPlacesLoading={isPlacesLoading} />

      {!selectedPlaceId ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <MapPin className="w-12 h-12 text-muted-foreground/40 mb-4" />
          <p className="text-muted-foreground">{t('hourlyRates.selectPlacePrompt')}</p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <DataTable
            columns={columns}
            data={paginatedRates}
            keyExtractor={(row) => row.userId}
            emptyMessage={
              <div className="py-12 text-center text-muted-foreground">
                {isLoading ? t('hourlyRates.loading') : t('hourlyRates.noResults')}
              </div>
            }
          />

          {filteredRates.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 border-t border-border">
              <p className="text-sm text-muted-foreground">
                {t('hourlyRates.showing', {
                  from: showingFrom,
                  to: showingTo,
                  total: filteredRates.length,
                })}
              </p>
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          )}
        </div>
      )}

      <AssignRateModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        employeeName={editingRate?.userName ?? ''}
        initialData={
          editingRate?.rate !== null && editingRate?.validFrom !== null
            ? {
                rate: editingRate?.rate ?? 0,
                validFrom: editingRate?.validFrom ?? '',
                validTo: editingRate?.validTo ?? null,
              }
            : null
        }
      />
    </div>
  )
}
