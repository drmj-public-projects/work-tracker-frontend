import { Timer, Play } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { useElapsedTime } from '../hooks/useElapsedTime'
import { formatElapsedTime } from '@/shared/utils/time-formatters'
import type { WorkSession } from '@/features/work-sessions/models/work-session.model'

interface ActivityCardProps {
  currentSession: WorkSession | null | undefined
}

export function ActivityCard({ currentSession }: ActivityCardProps) {
  const { t } = useTranslation('auth')
  const navigate = useNavigate()
  const elapsedSeconds = useElapsedTime(currentSession?.startTime)

  const handleEndWork = () => {
    navigate('/work-sessions/timer')
  }

  if (!currentSession) {
    return (
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
              {t('dashboard.currentActivity')}
            </p>
            <p className="text-xl font-semibold text-foreground">
              {t('dashboard.noActiveSession')}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {t('dashboard.startSessionPrompt')}
            </p>
          </div>
          <Link
            to="/work-sessions/timer"
            className="inline-flex items-center gap-2 px-5 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors"
          >
            <Play className="w-5 h-5" />
            {t('dashboard.startSession')}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
            {t('dashboard.currentActivity')}
          </p>
          <p className="text-4xl font-bold text-foreground tabular-nums tracking-tight">
            {formatElapsedTime(elapsedSeconds)}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm text-muted-foreground">
              {t('dashboard.activeSession')}{' '}
              <span className="text-foreground font-medium">
                {currentSession.place.name || t('dashboard.unknownPlace')}
              </span>
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={handleEndWork}
          className="inline-flex items-center gap-2 px-5 py-3 bg-destructive text-destructive-foreground rounded-xl font-semibold hover:bg-destructive/90 transition-colors shadow-lg shadow-destructive/20"
        >
          <Timer className="w-5 h-5" />
          {t('dashboard.endWork')}
        </button>
      </div>
    </div>
  )
}
