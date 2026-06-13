import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/shared/hooks/useToast'
import { placeService } from '../services/place.service'
import { mapPlaceResponseToPlace } from '../mappers/place.mapper'
import type { CreatePlaceRequestDTO } from '../dto/request/create-place.request.dto'
import type { UpdatePlaceRequestDTO } from '../types'

const PLACES_QUERY_KEY = 'places'

export function usePlaces(organizationId: string) {
  return useQuery({
    queryKey: [PLACES_QUERY_KEY, organizationId],
    queryFn: async () => {
      const response = await placeService.getByOrganizationId(organizationId)
      return response.data.data.map(mapPlaceResponseToPlace)
    },
    enabled: !!organizationId,
  })
}

export function usePlaceById(id: string | null) {
  return useQuery({
    queryKey: ['place', id],
    queryFn: async () => {
      if (!id) throw new Error('Place ID is required')
      const response = await placeService.getById(id)
      return mapPlaceResponseToPlace(response.data.data)
    },
    enabled: !!id,
  })
}

export function useCreatePlace() {
  const queryClient = useQueryClient()
  const { toastSuccess } = useToast()

  return useMutation({
    mutationFn: async (data: CreatePlaceRequestDTO) => {
      const response = await placeService.create(data)
      return mapPlaceResponseToPlace(response.data.data)
    },
    onSuccess: (_newPlace, variables) => {
      toastSuccess('toast.success.created')
      queryClient.invalidateQueries({
        queryKey: [PLACES_QUERY_KEY, variables.organizationId],
      })
    },
  })
}

export function useUpdatePlace(organizationId: string | null) {
  const queryClient = useQueryClient()
  const { toastSuccess } = useToast()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdatePlaceRequestDTO }) => {
      const response = await placeService.update(id, data)
      return mapPlaceResponseToPlace(response.data.data)
    },
    onSuccess: () => {
      toastSuccess('toast.success.updated')
      queryClient.invalidateQueries({
        queryKey: [PLACES_QUERY_KEY, organizationId],
      })
    },
  })
}
