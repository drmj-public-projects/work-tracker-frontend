import { apiService } from '@/shared/services'
import type { StartWorkSessionRequestDTO } from '../dto/request/start-work-session.request.dto'
import type { UpdateWorkSessionRequestDTO } from '../dto/request/update-work-session.request.dto'
import type { WorkSessionResponseDTO } from '../dto/response/work-session.response.dto'
import type { WorkSessionPlaceResponseDTO } from '../dto/response/work-session-place.response.dto'
import type { ApiResponse } from '@/shared/types/api-response.type'
import type { AxiosResponse } from 'axios'

export const workSessionService = {
  start: (
    data: StartWorkSessionRequestDTO
  ): Promise<AxiosResponse<ApiResponse<WorkSessionResponseDTO>>> =>
    apiService.post<ApiResponse<WorkSessionResponseDTO>>('/workSessions/start', data),

  updateActive: (
    data: UpdateWorkSessionRequestDTO
  ): Promise<AxiosResponse<ApiResponse<WorkSessionResponseDTO>>> =>
    apiService.patch<ApiResponse<WorkSessionResponseDTO>>('/workSessions/active', data),

  end: (
    id: string,
    userId: string,
    latitude?: number,
    longitude?: number
  ): Promise<AxiosResponse<ApiResponse<WorkSessionResponseDTO>>> => {
    let url = `/workSessions/${id}/end?userId=${userId}`
    if (latitude !== undefined) url += `&latitude=${latitude}`
    if (longitude !== undefined) url += `&longitude=${longitude}`
    return apiService.post<ApiResponse<WorkSessionResponseDTO>>(url)
  },

  getCurrentWorkSession: (): Promise<
    AxiosResponse<ApiResponse<WorkSessionPlaceResponseDTO | null>>
  > => apiService.get<ApiResponse<WorkSessionPlaceResponseDTO | null>>('/workSessions/getCurrentWorkSession'),
}