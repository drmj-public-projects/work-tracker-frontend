import { apiService } from '@/shared/services'
import type { OrganizationResponseDTO } from '@/shared/types/organization.response.dto'
import type { OrganizationSettingsResponseDTO } from '../dto/response/organization-settings.response.dto'
import type { ApiResponse } from '@/shared/types/api-response.type'
import type { AxiosResponse } from 'axios'

export const organizationService = {
  getOrganizations: (): Promise<AxiosResponse<ApiResponse<OrganizationResponseDTO[]>>> =>
    apiService.get<ApiResponse<OrganizationResponseDTO[]>>('/organizations/getOrganizations'),

  getSettings: (id: string): Promise<AxiosResponse<ApiResponse<OrganizationSettingsResponseDTO>>> =>
    apiService.get<ApiResponse<OrganizationSettingsResponseDTO>>(`/organizations/${id}/settings`),
}