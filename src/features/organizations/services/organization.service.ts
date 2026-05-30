import { apiService } from '@/shared/services'
import type { OrganizationResponseDTO } from '@/shared/types/organization.response.dto'
import type { ApiResponse } from '@/shared/types/api-response.type'
import type { AxiosResponse } from 'axios'

export const organizationService = {
  getOrganizations: (): Promise<AxiosResponse<ApiResponse<OrganizationResponseDTO[]>>> =>
    apiService.get<ApiResponse<OrganizationResponseDTO[]>>('/organizations/getOrganizations'),
}