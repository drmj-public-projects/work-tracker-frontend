import { formatInTimeZone } from 'date-fns-tz'

export function formatElapsedTime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export function formatMinutesToHours(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (mins === 0) return `${hours}h`
  return `${hours}h ${mins}m`
}

export function getWeekProgress(): { percentage: number; dayName: string } {
  const today = new Date()
  const dayOfWeek = today.getDay()
  const percentage = Math.round((dayOfWeek / 6) * 100)
  const dayName = today.toLocaleDateString('en-US', { weekday: 'long' })
  return { percentage, dayName }
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value)
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours === 0) return `${mins}m`
  if (mins === 0) return `${hours}h`
  return `${hours}h ${mins}m`
}

// ======================================================
// DEPRECATED: Legacy formatters (use timezone-aware versions below)
// These use the browser's local timezone and will be removed.
// ======================================================

/** @deprecated Use formatDateInTimeZone() instead */
export function formatDate(dateStr: string): { date: string; day: string } {
  const date = new Date(dateStr)
  return {
    date: date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    day: date.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase(),
  }
}

/** @deprecated Use formatTimeRangeInTimeZone() instead */
export function formatTimeRange(startTime: string, endTime?: string): string {
  const start = new Date(startTime)
  const startStr = start.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
  if (!endTime) return startStr
  const end = new Date(endTime)
  const endStr = end.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
  return `${startStr}\n${endStr}`
}

/** @deprecated Use formatDateShortInTimeZone() instead */
export function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const isToday = date.toDateString() === now.toDateString()
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  const isYesterday = date.toDateString() === yesterday.toDateString()

  if (isToday) return 'Today'
  if (isYesterday) return 'Yesterday'
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

/** @deprecated Use formatTimeInTimeZone() instead */
export function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

// ======================================================
// TIMEZONE-AWARE FORMATTERS
// ======================================================

export function formatDateInTimeZone(dateStr: string, timeZone: string): string {
  return formatInTimeZone(new Date(dateStr), timeZone, 'dd/MM/yyyy')
}

export function formatTimeInTimeZone(dateStr: string, timeZone: string): string {
  return formatInTimeZone(new Date(dateStr), timeZone, 'HH:mm')
}

export function formatTimeRangeInTimeZone(
  startTime: string,
  endTime: string | undefined,
  timeZone: string
): string {
  const startStr = formatInTimeZone(new Date(startTime), timeZone, 'HH:mm')
  if (!endTime) return startStr
  const endStr = formatInTimeZone(new Date(endTime), timeZone, 'HH:mm')
  return `${startStr} - ${endStr}`
}

export function formatDateShortInTimeZone(dateStr: string, timeZone: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  
  const dateInZone = formatInTimeZone(date, timeZone, 'yyyy-MM-dd')
  const nowInZone = formatInTimeZone(now, timeZone, 'yyyy-MM-dd')
  
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayInZone = formatInTimeZone(yesterday, timeZone, 'yyyy-MM-dd')
  
  if (dateInZone === nowInZone) return 'Today'
  if (dateInZone === yesterdayInZone) return 'Yesterday'
  return formatInTimeZone(date, timeZone, 'dd/MM/yyyy')
}

export function formatDateTimeInTimeZone(dateStr: string, timeZone: string): string {
  return formatInTimeZone(new Date(dateStr), timeZone, "dd/MM/yyyy HH:mm 'UTC'XXX")
}

export function toISOStringWithTimeZone(dateStr: string, timeZone: string): string {
  return formatInTimeZone(new Date(dateStr), timeZone, "yyyy-MM-dd'T'HH:mm:ssXXX")
}

// ======================================================
// TIME ZONES LIST
// ======================================================

export interface TimeZoneOption {
  value: string
  label: string
}

export const TIME_ZONES: TimeZoneOption[] = [
  { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
  { value: 'America/La_Paz', label: '(GMT-4) La Paz, Bolivia' },
  { value: 'America/Mexico_City', label: '(GMT-6) Ciudad de México, México' },
  { value: 'America/Lima', label: '(GMT-5) Lima, Perú' },
  { value: 'America/Bogota', label: '(GMT-5) Bogotá, Colombia' },
  { value: 'America/Santiago', label: '(GMT-4) Santiago, Chile' },
  { value: 'America/Buenos_Aires', label: '(GMT-3) Buenos Aires, Argentina' },
  { value: 'America/Sao_Paulo', label: '(GMT-3) São Paulo, Brasil' },
  { value: 'America/Caracas', label: '(GMT-4) Caracas, Venezuela' },
  { value: 'America/Montevideo', label: '(GMT-3) Montevideo, Uruguay' },
  { value: 'America/Asuncion', label: '(GMT-4) Asunción, Paraguay' },
  { value: 'America/Guayaquil', label: '(GMT-5) Guayaquil, Ecuador' },
  { value: 'America/Panama', label: '(GMT-5) Panamá, Panamá' },
  { value: 'America/Costa_Rica', label: '(GMT-6) San José, Costa Rica' },
  { value: 'America/Guatemala', label: '(GMT-6) Ciudad de Guatemala, Guatemala' },
  { value: 'America/Tegucigalpa', label: '(GMT-6) Tegucigalpa, Honduras' },
  { value: 'America/Managua', label: '(GMT-6) Managua, Nicaragua' },
  { value: 'America/El_Salvador', label: '(GMT-6) San Salvador, El Salvador' },
  { value: 'Europe/Madrid', label: '(GMT+1) Madrid, España' },
  { value: 'Europe/London', label: '(GMT+0) Londres, Reino Unido' },
]

export function getDefaultTimeZone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone
}

export function getTimeZoneLabel(value: string): string {
  const zone = TIME_ZONES.find((z) => z.value === value)
  return zone ? zone.label : value
}
