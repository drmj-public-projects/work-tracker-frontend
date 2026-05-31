export interface CalendarDay {
  date: Date
  dayOfMonth: number
  isCurrentMonth: boolean
  isToday: boolean
}

export function getMonthDays(year: number, month: number): CalendarDay[] {
  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const daysInMonth = lastDayOfMonth.getDate()
  const startDayOfWeek = firstDayOfMonth.getDay()

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const days: CalendarDay[] = []

  const prevMonthLastDay = new Date(year, month, 0).getDate()
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const date = new Date(year, month - 1, prevMonthLastDay - i)
    days.push({
      date,
      dayOfMonth: date.getDate(),
      isCurrentMonth: false,
      isToday: date.getTime() === today.getTime(),
    })
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i)
    days.push({
      date,
      dayOfMonth: i,
      isCurrentMonth: true,
      isToday: date.getTime() === today.getTime(),
    })
  }

  const remainingCells = 42 - days.length
  for (let i = 1; i <= remainingCells; i++) {
    const date = new Date(year, month + 1, i)
    days.push({
      date,
      dayOfMonth: i,
      isCurrentMonth: false,
      isToday: date.getTime() === today.getTime(),
    })
  }

  return days
}

export function getHeatmapColor(intensity: number): string {
  if (intensity === 0) return 'bg-transparent hover:bg-muted/30'
  if (intensity < 0.25) return 'bg-primary/10 hover:bg-primary/20'
  if (intensity < 0.5) return 'bg-primary/25 hover:bg-primary/35'
  if (intensity < 0.75) return 'bg-primary/50 hover:bg-primary/60'
  return 'bg-primary hover:bg-primary/90'
}

export function formatMonthYear(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
  }).format(date)
}

export function formatDayLabel(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
  }).format(date)
}

export function formatDateISO(date: Date): string {
  return date.toISOString().split('T')[0]
}
