import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { hourlyRateService } from '../services/hourly-rate.service'
import {
  mapHourlyRateByPlaceResponseToModel,
  mapHourlyRateStatsResponseToModel,
  mapHourlyRateResponseToModel,
} from '../mappers/hourly-rate.mapper'
import type { CreateHourlyRateRequestDTO } from '../dto/request/create-hourly-rate.request.dto'
import type { UpdateHourlyRateRequestDTO } from '../dto/request/update-hourly-rate.request.dto'

const HOURLY_RATES_QUERY_KEY = 'hourly-rates'
const HOURLY_RATE_STATS_QUERY_KEY = 'hourly-rate-stats'

export function useHourlyRates(placeId: string | null) {
  return useQuery({
    queryKey: [HOURLY_RATES_QUERY_KEY, placeId],
    queryFn: async () => {
      if (!placeId) throw new Error('Place ID is required')
      const response = await hourlyRateService.getByPlaceId(placeId)
      return response.data.data.map(mapHourlyRateByPlaceResponseToModel)
    },
    enabled: !!placeId,
  })
}

export function useHourlyRateStats(placeId: string | null) {
  return useQuery({
    queryKey: [HOURLY_RATE_STATS_QUERY_KEY, placeId],
    queryFn: async () => {
      if (!placeId) throw new Error('Place ID is required')
      const response = await hourlyRateService.getStats(placeId)
      return mapHourlyRateStatsResponseToModel(response.data.data)
    },
    enabled: !!placeId,
  })
}

export function useCreateHourlyRate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateHourlyRateRequestDTO) => {
      const response = await hourlyRateService.create(data)
      return mapHourlyRateResponseToModel(response.data.data)
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [HOURLY_RATES_QUERY_KEY, variables.placeId],
      })
      queryClient.invalidateQueries({
        queryKey: [HOURLY_RATE_STATS_QUERY_KEY, variables.placeId],
      })
    },
  })
}

export function useUpdateHourlyRate(placeId: string | null) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateHourlyRateRequestDTO }) => {
      const response = await hourlyRateService.update(id, data)
      return mapHourlyRateResponseToModel(response.data.data)
    },
    onSuccess: () => {
      if (!placeId) return
      queryClient.invalidateQueries({
        queryKey: [HOURLY_RATES_QUERY_KEY, placeId],
      })
      queryClient.invalidateQueries({
        queryKey: [HOURLY_RATE_STATS_QUERY_KEY, placeId],
      })
    },
  })
}

export function useDeleteHourlyRate(placeId: string | null) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      await hourlyRateService.delete(id)
    },
    onSuccess: () => {
      if (!placeId) return
      queryClient.invalidateQueries({
        queryKey: [HOURLY_RATES_QUERY_KEY, placeId],
      })
      queryClient.invalidateQueries({
        queryKey: [HOURLY_RATE_STATS_QUERY_KEY, placeId],
      })
    },
  })
}
