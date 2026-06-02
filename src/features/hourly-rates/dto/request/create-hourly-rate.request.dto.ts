export interface CreateHourlyRateRequestDTO {
  userId: string
  placeId: string
  rate: number
  validFrom: string
  validTo: string | null
}
