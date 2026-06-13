import { useCallback } from 'react'
import { useToast } from '@/shared/hooks/useToast'
import { useCurrentWorkSession, useEndWorkSession } from '@/features/work-sessions/hooks/useWorkSessions'
import { WorkSessionForm } from '@/features/work-sessions/components/WorkSessionForm'

export function ActiveTimerPage() {
  const { data: currentSession, isLoading: isLoadingSession } = useCurrentWorkSession()
  const endWorkSession = useEndWorkSession()
  const { toastSuccess } = useToast()

  const handleEndSession = useCallback(
    ({ latitude, longitude }: { latitude?: number; longitude?: number } = {}) => {
      if (!currentSession) return
      endWorkSession.mutate(
        {
          id: currentSession.id,
          userId: currentSession.userId,
          latitude,
          longitude,
        },
        {
          onSuccess: () => {
            toastSuccess('toast.success.updated')
          },
        }
      )
    },
    [currentSession, endWorkSession, toastSuccess]
  )

  if (isLoadingSession) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <WorkSessionForm
        currentSession={currentSession ?? null}
        onConfirmEndSession={handleEndSession}
        isEnding={endWorkSession.isPending}
      />
    </div>
  )
}
