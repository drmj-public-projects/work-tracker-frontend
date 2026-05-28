import { apiService } from '@/shared/services'
import type { LoginRequestDTO } from '../dto/request/login.request.dto'
import type { LoginResponseDTO } from '../dto/response/login.response.dto'
import type { SelectOrganizationRequestDTO } from '@/features/organizations/dto/request/select-organization.request.dto'
import type { TokenResponseDTO } from '../dto/response/token.response.dto'
import type { ApiResponse } from '@/shared/types/api-response.type'
import type { AxiosResponse } from 'axios'

export const authService = {
  login: (
    data: LoginRequestDTO
  ): Promise<AxiosResponse<ApiResponse<LoginResponseDTO>>> =>
    apiService.post<ApiResponse<LoginResponseDTO>>('/auth/login', data),

  selectOrganization: (
    data: SelectOrganizationRequestDTO
  ): Promise<AxiosResponse<ApiResponse<TokenResponseDTO>>> =>
    apiService.post<ApiResponse<TokenResponseDTO>>('/auth/select-organization', data),
}
