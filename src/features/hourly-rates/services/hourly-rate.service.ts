import { apiService } from '@/shared/services'
import type { CreateHourlyRateRequestDTO } from '../dto/request/create-hourly-rate.request.dto'
import type { UpdateHourlyRateRequestDTO } from '../dto/request/update-hourly-rate.request.dto'
import type { HourlyRateResponseDTO } from '../dto/response/hourly-rate.response.dto'
import type { HourlyRateByPlaceResponseDTO } from '../dto/response/hourly-rate-by-place.response.dto'
import type { HourlyRateStatsResponseDTO } from '../dto/response/hourly-rate-stats.response.dto'
import type { ApiResponse } from '@/shared/types/api-response.type'
import type { AxiosResponse } from 'axios'

export const hourlyRateService = {
  getByPlaceId: (
    placeId: string
  ): Promise<AxiosResponse<ApiResponse<HourlyRateByPlaceResponseDTO[]>>> =>
    apiService.get<ApiResponse<HourlyRateByPlaceResponseDTO[]>>(
      `/hourly-rates/by-place/${placeId}`
    ),

  getStats: (
    placeId: string
  ): Promise<AxiosResponse<ApiResponse<HourlyRateStatsResponseDTO>>> =>
    apiService.get<ApiResponse<HourlyRateStatsResponseDTO>>(
      `/hourly-rates/stats`,
      { params: { placeId } }
    ),

  create: (
    data: CreateHourlyRateRequestDTO
  ): Promise<AxiosResponse<ApiResponse<HourlyRateResponseDTO>>> =>
    apiService.post<ApiResponse<HourlyRateResponseDTO>>('/hourly-rates', data),

  update: (
    id: string,
    data: UpdateHourlyRateRequestDTO
  ): Promise<AxiosResponse<ApiResponse<HourlyRateResponseDTO>>> =>
    apiService.put<ApiResponse<HourlyRateResponseDTO>>(`/hourly-rates/${id}`, data),

  delete: (id: string): Promise<AxiosResponse<ApiResponse<void>>> =>
    apiService.delete<ApiResponse<void>>(`/hourly-rates/${id}`),
}
