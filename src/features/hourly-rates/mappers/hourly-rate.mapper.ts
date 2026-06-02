import type { HourlyRateByPlaceResponseDTO } from '../dto/response/hourly-rate-by-place.response.dto'
import type { HourlyRateStatsResponseDTO } from '../dto/response/hourly-rate-stats.response.dto'
import type { HourlyRateResponseDTO } from '../dto/response/hourly-rate.response.dto'

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

export function mapHourlyRateByPlaceResponseToModel(
  dto: HourlyRateByPlaceResponseDTO
): HourlyRateByPlace {
  return {
    userId: dto.userId,
    userName: dto.userName,
    userEmail: dto.userEmail,
    placeId: dto.placeId,
    placeName: dto.placeName,
    rateId: dto.rateId,
    rate: dto.rate,
    validFrom: dto.validFrom,
    validTo: dto.validTo,
    status: dto.status,
  }
}

export function mapHourlyRateStatsResponseToModel(
  dto: HourlyRateStatsResponseDTO
): HourlyRateStats {
  return {
    totalEmployees: dto.totalEmployees,
    activeRates: dto.activeRates,
    noRate: dto.noRate,
    expiringSoon: dto.expiringSoon,
  }
}

export function mapHourlyRateResponseToModel(
  dto: HourlyRateResponseDTO
): HourlyRate {
  return {
    id: dto.id,
    userId: dto.userId,
    placeId: dto.placeId,
    rate: dto.rate,
    validFrom: dto.validFrom,
    validTo: dto.validTo,
  }
}
