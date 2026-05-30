import { create } from 'zustand'
import type { LoginRequestDTO } from '@/features/auth/dto/request/login.request.dto'
import type { SelectOrganizationRequestDTO } from '@/features/organizations/dto/request/select-organization.request.dto'
import type { User } from '@/features/auth/models/user.model'
import type { UserOrganizationRole } from '@/shared/types/user-organization-role.enum'
import { authService } from '@/features/auth/services/auth.service'
import { mapLoginResponseToAuthData } from '@/features/auth/mappers/auth.mapper'
import { queryClient } from '@/app/providers'

const STORAGE_KEYS = {
  token: 'work_tracker_token',
  user: 'work_tracker_user',
  selectedOrg: 'work_tracker_selected_org',
  role: 'work_tracker_role',
} as const

interface AuthState {
  user: User | null
  token: string | null
  selectedOrganizationId: string | null
  role: UserOrganizationRole | null
  isLoading: boolean
  isAuthenticated: boolean

  login: (data: LoginRequestDTO) => Promise<void>
  selectOrganization: (data: SelectOrganizationRequestDTO) => Promise<void>
  logout: () => void
  hydrateFromStorage: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  selectedOrganizationId: null,
  role: null,
  isLoading: false,
  isAuthenticated: false,

  login: async (data: LoginRequestDTO) => {
    set({ isLoading: true })
    try {
      const response = await authService.login(data)
      const authData = mapLoginResponseToAuthData(response.data.data)

      localStorage.setItem(STORAGE_KEYS.token, authData.token)
      localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(authData.user))

      set({
        token: authData.token,
        user: authData.user,
        isAuthenticated: true,
        isLoading: false,
      })
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  selectOrganization: async (data: SelectOrganizationRequestDTO) => {
    set({ isLoading: true })
    try {
      const response = await authService.selectOrganization(data)
      const { token, organizationId, role } = response.data.data

      localStorage.setItem(STORAGE_KEYS.token, token)
      localStorage.setItem(STORAGE_KEYS.selectedOrg, organizationId)
      localStorage.setItem(STORAGE_KEYS.role, role)

      set({
        token,
        selectedOrganizationId: organizationId,
        role,
        isLoading: false,
      })
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.token)
    localStorage.removeItem(STORAGE_KEYS.user)
    localStorage.removeItem(STORAGE_KEYS.selectedOrg)
    localStorage.removeItem(STORAGE_KEYS.role)

    // Clear all TanStack Query cache to prevent data leaks between users
    queryClient.clear()

    set({
      user: null,
      token: null,
      selectedOrganizationId: null,
      role: null,
      isAuthenticated: false,
      isLoading: false,
    })
  },

  hydrateFromStorage: () => {
    const token = localStorage.getItem(STORAGE_KEYS.token)
    const userStr = localStorage.getItem(STORAGE_KEYS.user)
    const selectedOrg = localStorage.getItem(STORAGE_KEYS.selectedOrg)
    const role = localStorage.getItem(STORAGE_KEYS.role) as UserOrganizationRole | null

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr) as User
        set({
          token,
          user,
          selectedOrganizationId: selectedOrg,
          role,
          isAuthenticated: true,
        })
      } catch {
        localStorage.removeItem(STORAGE_KEYS.token)
        localStorage.removeItem(STORAGE_KEYS.user)
        localStorage.removeItem(STORAGE_KEYS.selectedOrg)
        localStorage.removeItem(STORAGE_KEYS.role)
      }
    }
  },
}))
