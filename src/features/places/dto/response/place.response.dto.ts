export interface PlaceResponseDTO {
  id: string
  name: string
  description: string
  latitude: number
  longitude: number
  radiusMeters: number
  isActive: boolean
  hourlyRate: number
  createdAt: string
  updatedAt: string
}
