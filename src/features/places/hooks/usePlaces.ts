import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { placeService } from '../services/place.service'
import { mapPlaceResponseToPlace } from '../mappers/place.mapper'
import type { CreatePlaceRequestDTO } from '../dto/request/create-place.request.dto'

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

export function useCreatePlace() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreatePlaceRequestDTO) => {
      const response = await placeService.create(data)
      return mapPlaceResponseToPlace(response.data.data)
    },
    onSuccess: (_newPlace, variables) => {
      // Invalidate and refetch places for this organization
      queryClient.invalidateQueries({
        queryKey: [PLACES_QUERY_KEY, variables.organizationId],
      })
    },
  })
}
