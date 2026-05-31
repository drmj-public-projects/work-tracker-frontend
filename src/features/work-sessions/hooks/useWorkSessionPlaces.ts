import { usePlaces } from '@/features/places/hooks/usePlaces'
import type { Place } from '@/features/places/models/place.model'

export function useWorkSessionPlaces(organizationId: string | null) {
  const { data: allPlaces, isLoading, error } = usePlaces(organizationId || '')

  const validPlaces: Place[] =
    allPlaces?.filter((place) => place.hourlyRate > 0 && place.isActive) ?? []

  return { data: validPlaces, isLoading, error }
}
