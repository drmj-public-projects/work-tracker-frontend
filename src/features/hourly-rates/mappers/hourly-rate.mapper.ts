import type { HourlyRateByPlaceResponseDTO } from '../dto/response/hourly-rate-by-place.response.dto'
import type { HourlyRateStatsResponseDTO } from '../dto/response/hourly-rate-stats.response.dto'
import type { HourlyRateResponseDTO } from '../dto/response/hourly-rate.response.dto'

import type { HourlyRateByPlace, HourlyRateStats, HourlyRate } from '../types'

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
