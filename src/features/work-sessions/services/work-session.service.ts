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
    userId: string
  ): Promise<AxiosResponse<ApiResponse<WorkSessionResponseDTO>>> =>
    apiService.post<ApiResponse<WorkSessionResponseDTO>>(`/workSessions/${id}/end?userId=${userId}`),

  getCurrentWorkSession: (): Promise<
    AxiosResponse<ApiResponse<WorkSessionPlaceResponseDTO | null>>
  > => apiService.get<ApiResponse<WorkSessionPlaceResponseDTO | null>>('/workSessions/getCurrentWorkSession'),
}