import { apiService } from '../api'
import { useAuthStore } from '@/shared/store/authStore'
import { queryClient } from '@/app/providers'
import type { ApiResponse } from '@/shared/types/api-response.type'

export function setupErrorInterceptor(): void {
  apiService.client.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error.response?.status
      const data = error.response?.data as ApiResponse<unknown> | undefined
      const errorCode = data?.errorCode
      const message = data?.message

      if (status === 401) {
        // toast will be handled by the component or can be added here
        // but for now we just redirect to login
        useAuthStore.getState().logout()
        queryClient.clear()
        window.location.href = '/login'
      } else if (status === 404) {
        import('@/shared/hooks/useToast').then(({ useToast }) => {
          const { toastError } = useToast()
          toastError(errorCode || 'NOT_FOUND', message)
        })
      } else if (status === 422) {
        import('@/shared/hooks/useToast').then(({ useToast }) => {
          const { toastError } = useToast()
          toastError(errorCode || 'VALIDATION_ERROR', message)
        })
      } else if (status === 500) {
        import('@/shared/hooks/useToast').then(({ useToast }) => {
          const { toastError } = useToast()
          toastError('GENERIC', message)
        })
      } else if (!status) {
        // Network error (no response)
        import('@/shared/hooks/useToast').then(({ useToast }) => {
          const { toastError } = useToast()
          toastError('NETWORK_ERROR')
        })
      } else if (status >= 400) {
        // Catch-all for other 4xx errors
        import('@/shared/hooks/useToast').then(({ useToast }) => {
          const { toastError } = useToast()
          toastError(errorCode || 'GENERIC', message)
        })
      }

      return Promise.reject(error)
    }
  )
}
