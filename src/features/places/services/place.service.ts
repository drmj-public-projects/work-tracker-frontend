import { apiService } from '@/shared/services'
import type { CreatePlaceRequestDTO } from '../dto/request/create-place.request.dto'
import type { PlaceResponseDTO } from '../dto/response/place.response.dto'
import type { ApiResponse } from '@/shared/types/api-response.type'
import type { AxiosResponse } from 'axios'

export interface UpdatePlaceRequestDTO {
  name: string
  description: string
  latitude: number
  longitude: number
  radiusMeters: number
}

export const placeService = {
  getById: (id: string): Promise<AxiosResponse<ApiResponse<PlaceResponseDTO>>> =>
    apiService.get<ApiResponse<PlaceResponseDTO>>(`/places/${id}`),

  getByOrganizationId: (
    organizationId: string
  ): Promise<AxiosResponse<ApiResponse<PlaceResponseDTO[]>>> =>
    apiService.get<ApiResponse<PlaceResponseDTO[]>>(
      `/places/getByOrganizationId/${organizationId}`
    ),

  create: (
    data: CreatePlaceRequestDTO
  ): Promise<AxiosResponse<ApiResponse<PlaceResponseDTO>>> =>
    apiService.post<ApiResponse<PlaceResponseDTO>>('/places', data),

  update: (id: string, dto: UpdatePlaceRequestDTO): Promise<AxiosResponse<ApiResponse<PlaceResponseDTO>>> =>
    apiService.put<ApiResponse<PlaceResponseDTO>>(`/places/${id}`, dto),
}
