export interface HourlyRateResponseDTO {
  id: string
  userId: string
  placeId: string
  rate: number
  validFrom: string
  validTo: string | null
}
