import { apiService } from '../api'
import { queryClient } from '@/app/providers'
import { useAuthStore } from '@/shared/store/authStore'

const STORAGE_KEY = 'work_tracker_token'

export function setupAuthInterceptor(): void {
  apiService.client.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem(STORAGE_KEY)
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => Promise.reject(error)
  )

  apiService.client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 403) {
        useAuthStore.getState().logout()
        queryClient.clear()
        window.location.href = '/login'
      }
      return Promise.reject(error)
    }
  )
}
