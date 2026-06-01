import { apiService } from '@/shared/services'
import type { OrganizationResponseDTO } from '@/shared/types/organization.response.dto'
import type { OrganizationSettingsResponseDTO } from '../dto/response/organization-settings.response.dto'
import type { SaveOrganizationSettingsRequestDTO } from '../dto/request/save-organization-settings.request.dto'
import type { ApiResponse } from '@/shared/types/api-response.type'
import type { AxiosResponse } from 'axios'

export const organizationService = {
  getOrganizations: (): Promise<AxiosResponse<ApiResponse<OrganizationResponseDTO[]>>> =>
    apiService.get<ApiResponse<OrganizationResponseDTO[]>>('/organizations/getOrganizations'),

  getById: (id: string): Promise<AxiosResponse<ApiResponse<OrganizationResponseDTO>>> =>
    apiService.get<ApiResponse<OrganizationResponseDTO>>(`/organizations/${id}`),

  getSettings: (id: string): Promise<AxiosResponse<ApiResponse<OrganizationSettingsResponseDTO>>> =>
    apiService.get<ApiResponse<OrganizationSettingsResponseDTO>>(`/organizations/${id}/settings`),

  saveSettings: (id: string, dto: SaveOrganizationSettingsRequestDTO): Promise<AxiosResponse<ApiResponse<OrganizationSettingsResponseDTO>>> =>
    apiService.put<ApiResponse<OrganizationSettingsResponseDTO>>(`/organizations/${id}/settings`, dto),
}