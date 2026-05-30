import type { PlaceResponseDTO } from '../dto/response/place.response.dto'
import type { Place } from '../models/place.model'

export function mapPlaceResponseToPlace(dto: PlaceResponseDTO): Place {
  return {
    id: dto.id,
    name: dto.name,
    description: dto.description,
    latitude: dto.latitude,
    longitude: dto.longitude,
    radiusMeters: dto.radiusMeters,
    isActive: dto.isActive,
    hourlyRate: dto.hourlyRate ?? 0,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  }
}
