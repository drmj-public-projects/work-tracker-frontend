export interface CreatePlaceRequestDTO {
  organizationId: string
  name: string
  description?: string
  latitude?: number
  longitude?: number
  radiusMeters?: number
}
