import { type ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'

interface PlaceSelectOption {
  id: string
  name: string
}

interface PlaceSelectProps {
  label: string
  placeholder: string
  value: string
  onChange: (value: string) => void
  options: PlaceSelectOption[]
  error?: string
  disabled?: boolean
  icon?: ReactNode
}

export function PlaceSelect({
  label,
  placeholder,
  value,
  onChange,
  options,
  error,
  disabled,
  icon,
}: PlaceSelectProps) {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-foreground mb-2">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`w-full h-[var(--input-height-md)] bg-input/30 border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all appearance-none px-4 pr-10 ${
            error
              ? 'border-destructive focus:ring-destructive/30'
              : 'border-border focus:ring-ring'
          }`}
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.name}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
          {icon ?? <ChevronDown className="w-5 h-5" />}
        </div>
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-destructive">{error}</p>
      )}
    </div>
  )
}
