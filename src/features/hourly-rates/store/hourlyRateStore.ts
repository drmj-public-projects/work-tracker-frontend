import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type HourlyRateTabFilter = 'ALL' | 'WITH_RATE' | 'NO_RATE'

interface HourlyRateState {
  selectedPlaceId: string | null
  tabFilter: HourlyRateTabFilter
  searchQuery: string
  page: number
  pageSize: number

  setSelectedPlaceId: (placeId: string | null) => void
  setTabFilter: (filter: HourlyRateTabFilter) => void
  setSearchQuery: (query: string) => void
  setPage: (page: number) => void
  setPageSize: (size: number) => void
  resetFilters: () => void
}

const defaultState = {
  selectedPlaceId: null,
  tabFilter: 'ALL' as HourlyRateTabFilter,
  searchQuery: '',
  page: 0,
  pageSize: 10,
}

export const useHourlyRateStore = create<HourlyRateState>()(
  persist(
    (set) => ({
      ...defaultState,

      setSelectedPlaceId: (placeId) =>
        set({ selectedPlaceId: placeId, page: 0 }),

      setTabFilter: (filter) =>
        set({ tabFilter: filter, page: 0 }),

      setSearchQuery: (query) =>
        set({ searchQuery: query, page: 0 }),

      setPage: (page) => set({ page }),

      setPageSize: (pageSize) => set({ pageSize, page: 0 }),

      resetFilters: () => set({ ...defaultState }),
    }),
    {
      name: 'work_tracker_hourly_rates_filters',
      partialize: (state) => ({
        selectedPlaceId: state.selectedPlaceId,
        tabFilter: state.tabFilter,
        searchQuery: state.searchQuery,
        pageSize: state.pageSize,
      }),
    }
  )
)
