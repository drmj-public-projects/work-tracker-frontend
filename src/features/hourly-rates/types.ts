export interface HourlyRateByPlace {
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

export interface HourlyRateStats {
  totalEmployees: number
  activeRates: number
  noRate: number
  expiringSoon: number
}

export interface HourlyRate {
  id: string
  userId: string
  placeId: string
  rate: number
  validFrom: string
  validTo: string | null
}
