import { apiService } from '@/shared/services'
import type { ApiResponse } from '@/shared/types/api-response.type'
import type { InvitationCodeResponseDTO } from '../dto/response/invitation-code.response.dto'
import type { InvitationCodeStatsResponseDTO } from '../dto/response/invitation-code-stats.response.dto'
import type { AxiosResponse } from 'axios'

interface PageDTO<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
  first: boolean
  last: boolean
}

import type { GenerateInvitationCodeRequestDTO } from '../types'

export const invitationCodeService = {
  getByOrganizationId: (
    organizationId: string,
    page: number = 0,
    size: number = 10
  ): Promise<AxiosResponse<ApiResponse<PageDTO<InvitationCodeResponseDTO>>>> =>
    apiService.get<ApiResponse<PageDTO<InvitationCodeResponseDTO>>>(
      `/organizations/${organizationId}/invitation-codes?page=${page}&size=${size}`
    ),

  getStats: (
    organizationId: string
  ): Promise<AxiosResponse<ApiResponse<InvitationCodeStatsResponseDTO>>> =>
    apiService.get<ApiResponse<InvitationCodeStatsResponseDTO>>(
      `/organizations/${organizationId}/invitation-codes/stats`
    ),

  generate: (
    dto: GenerateInvitationCodeRequestDTO
  ): Promise<AxiosResponse<ApiResponse<InvitationCodeResponseDTO>>> =>
    apiService.post<ApiResponse<InvitationCodeResponseDTO>>('/organizations/invite-code', dto),

  revoke: (
    invitationCodeId: string
  ): Promise<AxiosResponse<ApiResponse<InvitationCodeResponseDTO>>> =>
    apiService.delete<ApiResponse<InvitationCodeResponseDTO>>(
      `/organizations/invitation-codes/${invitationCodeId}`
    ),
}
