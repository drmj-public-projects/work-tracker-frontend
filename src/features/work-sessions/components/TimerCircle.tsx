import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Play, Square, Loader2 } from 'lucide-react'

export function formatDuration(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

interface TimerCircleProps {
  startTime?: string
  isRunning: boolean
  onToggle: () => void
  isPending: boolean
}

export function TimerCircle({
  startTime,
  isRunning,
  onToggle,
  isPending,
}: TimerCircleProps) {
  const { t } = useTranslation('auth')
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    if (!isRunning || !startTime) {
      setElapsed(0)
      return
    }
    const start = new Date(startTime).getTime()
    setElapsed(Math.floor((Date.now() - start) / 1000))
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - start) / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [isRunning, startTime])

  const displaySeconds = isRunning ? elapsed : 0

  return (
    <div className="relative w-64 h-64 mx-auto">
      <div className="w-full h-full rounded-full border-[6px] border-primary/10 flex flex-col items-center justify-center bg-card">
        <span className="text-5xl font-mono font-bold text-foreground tracking-wider">
          {formatDuration(displaySeconds)}
        </span>
        <span className="mt-2 px-4 py-1.5 bg-muted rounded-full text-xs font-semibold text-muted-foreground uppercase tracking-widest">
          {isRunning ? t('activeTimer.inProgress') : t('activeTimer.ready')}
        </span>
      </div>

      <button
        type="button"
        onClick={onToggle}
        disabled={isPending}
        className={`absolute bottom-2 right-2 w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
          isRunning
            ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
            : 'bg-success text-success-foreground hover:bg-success/90'
        }`}
      >
        {isPending ? (
          <Loader2 className="w-7 h-7 animate-spin" />
        ) : isRunning ? (
          <Square className="w-7 h-7 fill-current" />
        ) : (
          <Play className="w-7 h-7 fill-current ml-1" />
        )}
      </button>
    </div>
  )
}
