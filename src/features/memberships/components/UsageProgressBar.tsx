interface UsageProgressBarProps {
  currentUses: number
  maxUses: number
}

export function UsageProgressBar({ currentUses, maxUses }: UsageProgressBarProps) {
  const percentage = Math.min((currentUses / maxUses) * 100, 100)

  let barColor = 'bg-emerald-500'
  if (percentage >= 100) {
    barColor = 'bg-red-500'
  } else if (percentage >= 75) {
    barColor = 'bg-amber-500'
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-medium text-foreground">
          {currentUses} / {maxUses}
        </span>
      </div>
      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full ${barColor} rounded-full transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
