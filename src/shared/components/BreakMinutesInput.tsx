import { Coffee } from 'lucide-react'
import type { ReactNode } from 'react'

interface BreakMinutesInputProps {
  label: string
  value: number
  onChange: (value: number) => void
  onBlur?: () => void
  hint?: string
  suffix?: ReactNode
  min?: number
}

export function BreakMinutesInput({
  label,
  value,
  onChange,
  onBlur,
  hint,
  suffix,
  min = 0,
}: BreakMinutesInputProps) {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-foreground mb-2">
        {label}
      </label>
      <div className="relative">
        <Coffee className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
        <input
          type="number"
          min={min}
          value={value}
          onChange={(e) =>
            onChange(Math.max(min, Number(e.target.value)))
          }
          onBlur={onBlur}
          className="w-full h-[var(--input-height-md)] bg-input/30 border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all pl-10 pr-10"
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium pointer-events-none">
            {suffix}
          </span>
        )}
      </div>
      {hint && (
        <p className="mt-1.5 text-sm text-muted-foreground italic">{hint}</p>
      )}
    </div>
  )
}
