import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useToast } from '@/shared/hooks/useToast'
import { useWorkSessionPlaces } from '@/features/work-sessions/hooks/useWorkSessionPlaces'
import { useCreateManualWorkSession } from '@/features/work-sessions/hooks/useWorkSessions'
import { useAuthStore } from '@/shared/store/authStore'
import { PlaceSelect } from '@/shared/components/PlaceSelect'
import { BreakMinutesInput } from '@/shared/components/BreakMinutesInput'
import { NotesTextarea } from '@/shared/components/NotesTextarea'
import { withLocation } from '@/shared/utils/withLocation'
import { SessionPreview } from '@/features/work-sessions/components/SessionPreview'
import { Guidelines } from '@/features/work-sessions/components/Guidelines'
import { DateTimeField } from '@/features/work-sessions/components/DateTimeField'
import { toISOStringWithTimeZone } from '@/shared/utils/time-formatters'

export function ManualEntryPage() {
  const { t } = useTranslation('auth')
  const navigate = useNavigate()
  const { toastSuccess } = useToast()
  const selectedOrganizationId = useAuthStore((state) => state.selectedOrganizationId)
  const user = useAuthStore((state) => state.user)
  const organizationSettings = useAuthStore((state) => state.organizationSettings)
  const requiresLocation = organizationSettings?.requireLocation ?? false
  const { data: places, isLoading: isLoadingPlaces } = useWorkSessionPlaces(selectedOrganizationId)
  const createManualWorkSession = useCreateManualWorkSession()

  const [selectedPlaceId, setSelectedPlaceId] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [breakMinutes, setBreakMinutes] = useState(0)
  const [notes, setNotes] = useState('')
  const [errors, setErrors] = useState<{
    place?: string
    startTime?: string
    endTime?: string
  }>({})

  const preview = useMemo(() => {
    if (!startTime || !endTime) return null
    const start = new Date(startTime)
    const end = new Date(endTime)
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) return null

    const grossMinutes = Math.round((end.getTime() - start.getTime()) / 60000)
    const netMinutes = Math.max(0, grossMinutes - breakMinutes)

    return { grossMinutes, netMinutes }
  }, [startTime, endTime, breakMinutes])

  const validate = () => {
    const errs: { place?: string; startTime?: string; endTime?: string } = {}
    if (!selectedPlaceId) errs.place = t('manualEntry.validation.placeRequired')
    if (!startTime) errs.startTime = t('manualEntry.validation.startTimeRequired')
    if (!endTime) errs.endTime = t('manualEntry.validation.endTimeRequired')
    if (startTime && endTime) {
      const s = new Date(startTime)
      const e = new Date(endTime)
      if (e <= s) {
        errs.endTime = t('manualEntry.validation.endAfterStart')
      }
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = () => {
    if (!validate() || !user || !selectedOrganizationId) return

    const timeZone = organizationSettings?.timeZone || 'UTC'

    withLocation(requiresLocation, (latitude, longitude) => {
      createManualWorkSession.mutate(
        {
          userId: user.id,
          organizationId: selectedOrganizationId,
          placeId: selectedPlaceId,
          startTime: toISOStringWithTimeZone(startTime, timeZone),
          endTime: toISOStringWithTimeZone(endTime, timeZone),
          breakMinutes: Math.max(0, breakMinutes),
          notes: notes || undefined,
          latitude,
          longitude,
        },
        {
          onSuccess: () => {
            setSelectedPlaceId('')
            setStartTime('')
            setEndTime('')
            setBreakMinutes(0)
            setNotes('')
            setErrors({})
            toastSuccess('toast.success.created')
          },
        }
      )
    })
  }

  const handleCancel = () => {
    navigate('/work-sessions/timer')
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-1">
        {t('manualEntry.title')}
      </h1>
      <p className="text-muted-foreground mb-8">
        {t('manualEntry.subtitle')}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-8">
          <div className="space-y-6 max-w-xl">
            <PlaceSelect
              label={t('manualEntry.place')}
              placeholder={t('manualEntry.selectPlacePlaceholder')}
              value={selectedPlaceId}
              onChange={(value) => {
                setSelectedPlaceId(value)
                setErrors((prev) => ({ ...prev, place: undefined }))
              }}
              options={places?.map((p) => ({ id: p.id, name: p.name })) ?? []}
              error={errors.place}
              disabled={isLoadingPlaces}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <DateTimeField
                label={t('manualEntry.startTime')}
                value={startTime}
                onChange={(value) => {
                  setStartTime(value)
                  setErrors((prev) => ({ ...prev, startTime: undefined }))
                }}
                error={errors.startTime}
              />

              <DateTimeField
                label={t('manualEntry.endTime')}
                value={endTime}
                onChange={(value) => {
                  setEndTime(value)
                  setErrors((prev) => ({ ...prev, endTime: undefined }))
                }}
                error={errors.endTime}
              />
            </div>

            <BreakMinutesInput
              label={t('manualEntry.breakMinutes')}
              value={breakMinutes}
              onChange={setBreakMinutes}
              hint={t('manualEntry.breakMinutesHint')}
              suffix="MIN"
            />

            <NotesTextarea
              label={t('manualEntry.notes')}
              value={notes}
              onChange={setNotes}
              placeholder={t('manualEntry.notesPlaceholder')}
              icon={<span className="w-5 h-5" />}
            />
          </div>

          <div className="mt-8 pt-6 border-t border-border flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={handleCancel}
              className="h-[var(--button-height-md)] px-6 text-muted-foreground font-medium hover:text-foreground transition-colors"
            >
              {t('manualEntry.cancel')}
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={createManualWorkSession.isPending}
              className="h-[var(--button-height-md)] px-8 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary-hover active:bg-primary-active transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {createManualWorkSession.isPending && (
                <Loader2 className="w-5 h-5 animate-spin" />
              )}
              {t('manualEntry.saveSession')}
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <SessionPreview
            grossMinutes={preview?.grossMinutes ?? null}
            breakMinutes={breakMinutes}
            netMinutes={preview?.netMinutes ?? null}
          />
          <Guidelines />
        </div>
      </div>
    </div>
  )
}
