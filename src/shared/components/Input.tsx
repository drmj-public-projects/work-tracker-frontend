import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  icon?: ReactNode
  suffix?: ReactNode
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, icon, suffix, error, className = '', ...props }, ref) => {
    const inputBaseClasses =
      'w-full h-[var(--input-height-md)] bg-input/30 border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all'

    const errorClasses = error
      ? 'border-destructive focus:ring-destructive/30'
      : 'border-border focus:ring-ring'

    const leftPad = icon ? 'pl-10' : 'pl-4'
    const rightPad = suffix ? 'pr-10' : 'pr-4'

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-foreground mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            className={`${inputBaseClasses} ${errorClasses} ${leftPad} ${rightPad} ${className}`}
            {...props}
          />
          {suffix && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {suffix}
            </span>
          )}
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-destructive">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
