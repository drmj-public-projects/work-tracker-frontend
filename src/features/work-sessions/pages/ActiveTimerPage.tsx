import { useCallback } from 'react'
import { useCurrentWorkSession, useEndWorkSession } from '@/features/work-sessions/hooks/useWorkSessions'
import { WorkSessionForm } from '@/features/work-sessions/components/WorkSessionForm'

export function ActiveTimerPage() {
  const { data: currentSession, isLoading: isLoadingSession } = useCurrentWorkSession()
  const endWorkSession = useEndWorkSession()

  const handleEndSession = useCallback(() => {
    if (!currentSession) return
    endWorkSession.mutate({
      id: currentSession.id,
      userId: currentSession.userId,
    })
  }, [currentSession, endWorkSession])

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
