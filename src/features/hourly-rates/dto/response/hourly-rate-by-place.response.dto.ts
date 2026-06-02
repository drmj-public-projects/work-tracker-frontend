export interface HourlyRateByPlaceResponseDTO {
  userId: string
  userName: string
  userEmail: string
  placeId: string
  placeName: string
  rateId: string | null
  rate: number | null
  validFrom: string | null
  validTo: string | null
  status: 'ACTIVE' | 'EXPIRING_SOON' | 'EXPIRED' | 'NO_RATE'
}
