import type { ReactNode } from 'react'

interface NotesTextareaProps {
  label: string
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  placeholder?: string
  error?: string
  icon?: ReactNode
  rows?: number
}

export function NotesTextarea({
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  icon,
  rows = 4,
}: NotesTextareaProps) {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-foreground mb-2">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-3.5 text-muted-foreground pointer-events-none">
            {icon}
          </div>
        )}
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          rows={rows}
          className={`w-full min-h-[100px] bg-input/30 border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all resize-y ${
            icon ? 'pl-10' : 'px-4'
          } pr-4 py-3 ${
            error
              ? 'border-destructive focus:ring-destructive/30'
              : 'border-border focus:ring-ring'
          }`}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-destructive">{error}</p>
      )}
    </div>
  )
}
