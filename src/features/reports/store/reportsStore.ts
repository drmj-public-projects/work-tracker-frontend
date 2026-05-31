import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ReportRange = 'THIS_WEEK' | 'LAST_WEEK' | 'THIS_MONTH' | 'LAST_MONTH' | 'CUSTOM'
export type ReportGroupBy = 'DAY' | 'WEEK' | 'MONTH'
export type ReportStatus = 'ACTIVE' | 'COMPLETED' | 'PENDING' | 'REJECTED'

interface AnalyticsFilters {
  range: ReportRange
  groupBy: ReportGroupBy
  placeId: string | null
  status: ReportStatus[]
  startDate: string | null
  endDate: string | null
}

interface CalendarFilters {
  month: string // YYYY-MM format
  placeId: string | null
}

interface HistoryFilters {
  range: ReportRange
  placeId: string | null
  status: ReportStatus[]
  startDate: string | null
  endDate: string | null
  page: number
  size: number
}

interface ReportsState {
  analyticsFilters: AnalyticsFilters
  calendarFilters: CalendarFilters
  historyFilters: HistoryFilters

  setAnalyticsFilters: (filters: Partial<AnalyticsFilters>) => void
  setCalendarFilters: (filters: Partial<CalendarFilters>) => void
  setHistoryFilters: (filters: Partial<HistoryFilters>) => void
  resetAnalyticsFilters: () => void
  resetCalendarFilters: () => void
  resetHistoryFilters: () => void
}

const defaultAnalyticsFilters: AnalyticsFilters = {
  range: 'THIS_WEEK',
  groupBy: 'DAY',
  placeId: null,
  status: ['COMPLETED'],
  startDate: null,
  endDate: null,
}

const defaultCalendarFilters: CalendarFilters = {
  month: new Date().toISOString().slice(0, 7),
  placeId: null,
}

const defaultHistoryFilters: HistoryFilters = {
  range: 'THIS_MONTH',
  placeId: null,
  status: [],
  startDate: null,
  endDate: null,
  page: 0,
  size: 20,
}

export const useReportsStore = create<ReportsState>()(
  persist(
    (set) => ({
      analyticsFilters: defaultAnalyticsFilters,
      calendarFilters: defaultCalendarFilters,
      historyFilters: defaultHistoryFilters,

      setAnalyticsFilters: (filters) =>
        set((state) => ({
          analyticsFilters: { ...state.analyticsFilters, ...filters },
        })),

      setCalendarFilters: (filters) =>
        set((state) => ({
          calendarFilters: { ...state.calendarFilters, ...filters },
        })),

      setHistoryFilters: (filters) =>
        set((state) => ({
          historyFilters: { ...state.historyFilters, ...filters },
        })),

      resetAnalyticsFilters: () =>
        set({ analyticsFilters: defaultAnalyticsFilters }),

      resetCalendarFilters: () =>
        set({ calendarFilters: defaultCalendarFilters }),

      resetHistoryFilters: () =>
        set({ historyFilters: defaultHistoryFilters }),
    }),
    {
      name: 'work_tracker_reports_filters',
      partialize: (state) => ({
        analyticsFilters: state.analyticsFilters,
        calendarFilters: state.calendarFilters,
        historyFilters: state.historyFilters,
      }),
    }
  )
)
