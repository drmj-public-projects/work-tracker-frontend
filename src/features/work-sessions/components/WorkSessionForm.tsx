import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { MapPin, ChevronDown } from 'lucide-react'
import {
  useStartWorkSession,
  useUpdateActiveWorkSession,
} from '@/features/work-sessions/hooks/useWorkSessions'
import { useWorkSessionPlaces } from '@/features/work-sessions/hooks/useWorkSessionPlaces'
import { useAuthStore } from '@/shared/store/authStore'
import { Input } from '@/shared/components/Input'
import { TimerCircle } from './TimerCircle'
import { EndSessionModal } from './EndSessionModal'
import type { WorkSession } from '@/features/work-sessions/models/work-session.model'

interface WorkSessionFormProps {
  currentSession: WorkSession | null
  onConfirmEndSession: () => void
  isEnding: boolean
}

export function WorkSessionForm({
  currentSession,
  onConfirmEndSession,
  isEnding,
}: WorkSessionFormProps) {
  const { t } = useTranslation('auth')
  const selectedOrganizationId = useAuthStore((state) => state.selectedOrganizationId)
  const user = useAuthStore((state) => state.user)
  const {
    data: places,
    isLoading: isLoadingPlaces,
    error: placesError,
  } = useWorkSessionPlaces(selectedOrganizationId)
  const startWorkSession = useStartWorkSession()
  const updateActiveWorkSession = useUpdateActiveWorkSession()

  const [selectedPlaceId, setSelectedPlaceId] = useState('')
  const [breakMinutes, setBreakMinutes] = useState(0)
  const [notes, setNotes] = useState('')
  const [validationErrors, setValidationErrors] = useState<{
    place?: string
    notes?: string
  }>({})
  const [showEndModal, setShowEndModal] = useState(false)

  const [activeBreakMinutes, setActiveBreakMinutes] = useState(0)
  const [originalBreakMinutes, setOriginalBreakMinutes] = useState(0)
  const [activeNotes, setActiveNotes] = useState('')
  const [originalNotes, setOriginalNotes] = useState('')

  useEffect(() => {
    if (currentSession) {
      setActiveBreakMinutes(currentSession.breakMinutes)
      setOriginalBreakMinutes(currentSession.breakMinutes)
      setActiveNotes(currentSession.notes || '')
      setOriginalNotes(currentSession.notes || '')
    }
  }, [currentSession])

  const handleUpdateActive = useCallback(() => {
    const breakChanged = activeBreakMinutes !== originalBreakMinutes
    const notesChanged = activeNotes !== originalNotes
    if (!breakChanged && !notesChanged) return

    updateActiveWorkSession.mutate(
      {
        workSessionId: currentSession?.id,
        breakMinutes: activeBreakMinutes,
        notes: activeNotes || undefined,
      },
      {
        onSuccess: () => {
          setOriginalBreakMinutes(activeBreakMinutes)
          setOriginalNotes(activeNotes)
        },
      }
    )
  }, [activeBreakMinutes, activeNotes, originalBreakMinutes, originalNotes, updateActiveWorkSession, currentSession?.id])

  const handleStartSession = useCallback(() => {
    if (!user || !selectedOrganizationId) return

    const errors: { place?: string; notes?: string } = {}
    if (!selectedPlaceId) {
      errors.place = t('activeTimer.validation.placeRequired')
    }
    if (!notes.trim()) {
      errors.notes = t('activeTimer.validation.notesRequired')
    }
    setValidationErrors(errors)
    if (Object.keys(errors).length > 0) return

    const start = (latitude?: number, longitude?: number) => {
      startWorkSession.mutate({
        userId: user.id,
        organizationId: selectedOrganizationId,
        placeId: selectedPlaceId,
        breakMinutes,
        notes: notes || undefined,
        latitude,
        longitude,
      })
    }

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          start(position.coords.latitude, position.coords.longitude)
        },
        () => {
          start()
        },
        { enableHighAccuracy: true, timeout: 10000 }
      )
    } else {
      start()
    }
  }, [user, selectedOrganizationId, selectedPlaceId, breakMinutes, notes, startWorkSession, t])

  const isRunning = !!currentSession

  return (
    <div className="bg-card rounded-2xl border border-border p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground">
          {isRunning ? t('activeTimer.title') : t('activeTimer.readyTitle')}
        </h2>
        <p className="text-muted-foreground mt-1">
          {isRunning
            ? t('activeTimer.activeSubtitle')
            : t('activeTimer.readySubtitle')}
        </p>
      </div>

      <div className="mb-10">
        <TimerCircle
          startTime={currentSession?.startTime}
          isRunning={isRunning}
          onToggle={
            isRunning ? () => setShowEndModal(true) : handleStartSession
          }
          isPending={
            startWorkSession.isPending ||
            isEnding ||
            updateActiveWorkSession.isPending
          }
        />
      </div>

      <div className="space-y-5 max-w-lg mx-auto">
        {isRunning ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="w-full">
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t('activeTimer.place')}
                </label>
                <div className="w-full h-[var(--input-height-md)] bg-muted/50 border border-border rounded-lg flex items-center px-4 text-foreground">
                  <MapPin className="w-4 h-4 text-muted-foreground mr-2" />
                  <span className="text-sm">{currentSession.place.name}</span>
                </div>
              </div>

              <Input
                type="number"
                min={0}
                label={t('activeTimer.breakMinutesLabel')}
                value={activeBreakMinutes}
                onChange={(e) =>
                  setActiveBreakMinutes(Math.max(0, Number(e.target.value)))
                }
                onBlur={handleUpdateActive}
                suffix={
                  <span className="text-sm text-muted-foreground font-medium">
                    MIN
                  </span>
                }
              />
            </div>

            <div className="w-full">
              <label className="block text-sm font-medium text-foreground mb-2">
                {t('activeTimer.notesLabel')}
              </label>
              <textarea
                value={activeNotes}
                onChange={(e) => setActiveNotes(e.target.value)}
                onBlur={handleUpdateActive}
                placeholder={t('activeTimer.notesPlaceholder')}
                rows={3}
                className="w-full min-h-[100px] bg-input/30 border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all px-4 py-3 resize-y"
              />
            </div>
          </>
        ) : (
          <>
            {isLoadingPlaces ? (
              <div className="flex items-center justify-center py-8">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  {t('activeTimer.placesLoading')}
                </div>
              </div>
            ) : placesError ? (
              <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center">
                {t('activeTimer.placesError')}
              </div>
            ) : !places || places.length === 0 ? (
              <div className="text-center py-8">
                <MapPin className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">
                  {t('activeTimer.noPlacesWithRate')}
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="w-full">
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {t('activeTimer.selectLocation')}
                    </label>
                    <div className="relative">
                      <select
                        value={selectedPlaceId}
                        onChange={(e) => {
                          setSelectedPlaceId(e.target.value)
                          if (validationErrors.place) {
                            setValidationErrors((prev) => ({
                              ...prev,
                              place: undefined,
                            }))
                          }
                        }}
                        className={`w-full h-[var(--input-height-md)] bg-input/30 border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all appearance-none px-4 pr-10 ${
                          validationErrors.place
                            ? 'border-destructive focus:ring-destructive/30'
                            : 'border-border focus:ring-ring'
                        }`}
                      >
                        <option value="">
                          {t('activeTimer.selectLocationPlaceholder')}
                        </option>
                        {places.map((place) => (
                          <option key={place.id} value={place.id}>
                            {place.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                    </div>
                    {validationErrors.place && (
                      <p className="mt-1.5 text-sm text-destructive">
                        {validationErrors.place}
                      </p>
                    )}
                  </div>

                  <Input
                    type="number"
                    min={0}
                    label={t('activeTimer.breakMinutesLabel')}
                    placeholder={t('activeTimer.breakMinutesPlaceholder')}
                    value={breakMinutes}
                    onChange={(e) =>
                      setBreakMinutes(Math.max(0, Number(e.target.value)))
                    }
                    suffix={
                      <span className="text-sm text-muted-foreground font-medium">
                        MIN
                      </span>
                    }
                  />
                </div>

                <div className="w-full">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t('activeTimer.notesLabel')}
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => {
                      setNotes(e.target.value)
                      if (validationErrors.notes) {
                        setValidationErrors((prev) => ({
                          ...prev,
                          notes: undefined,
                        }))
                      }
                    }}
                    placeholder={t('activeTimer.notesPlaceholder')}
                    rows={3}
                    className={`w-full min-h-[100px] bg-input/30 border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all px-4 py-3 resize-y ${
                      validationErrors.notes
                        ? 'border-destructive focus:ring-destructive/30'
                        : 'border-border focus:ring-ring'
                    }`}
                  />
                  {validationErrors.notes && (
                    <p className="mt-1.5 text-sm text-destructive">
                      {validationErrors.notes}
                    </p>
                  )}
                </div>
              </>
            )}
          </>
        )}
      </div>

      <EndSessionModal
        isOpen={showEndModal}
        onClose={() => setShowEndModal(false)}
        onConfirm={onConfirmEndSession}
        isPending={isEnding}
        placeName={currentSession?.place.name || ''}
        breakMinutes={activeBreakMinutes}
        notes={activeNotes}
      />
    </div>
  )
}
