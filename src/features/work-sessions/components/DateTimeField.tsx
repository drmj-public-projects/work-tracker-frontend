interface DateTimeFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
}

export function DateTimeField({ label, value, onChange, error }: DateTimeFieldProps) {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-foreground mb-2">
        {label}
      </label>
      <input
        type="datetime-local"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full h-[var(--input-height-md)] bg-input/30 border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all px-4 ${
          error
            ? 'border-destructive focus:ring-destructive/30'
            : 'border-border focus:ring-ring'
        }`}
      />
      {error && (
        <p className="mt-1.5 text-sm text-destructive">{error}</p>
      )}
    </div>
  )
}
