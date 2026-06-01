import { apiService } from '@/shared/services'
import type { ApiResponse } from '@/shared/types/api-response.type'
import type { JoinOrganizationRequestDTO } from '../dto/request/join-organization.request.dto'
import type { MembershipResponseDTO } from '../dto/response/membership.response.dto'
import type { AxiosResponse } from 'axios'

export const membershipService = {
  joinOrganization: (
    dto: JoinOrganizationRequestDTO
  ): Promise<AxiosResponse<ApiResponse<MembershipResponseDTO>>> =>
    apiService.post<ApiResponse<MembershipResponseDTO>>('/membership/join-organization', dto),
}
