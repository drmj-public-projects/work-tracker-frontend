import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { workSessionService } from '../services/work-session.service'
import {
  mapWorkSessionResponseToWorkSession,
  mapWorkSessionPlaceResponseToWorkSession,
} from '../mappers/work-session.mapper'
import type { StartWorkSessionRequestDTO } from '../dto/request/start-work-session.request.dto'
import type { UpdateWorkSessionRequestDTO } from '../dto/request/update-work-session.request.dto'

const WORK_SESSION_QUERY_KEY = 'workSessions'

export function useCurrentWorkSession() {
  return useQuery({
    queryKey: [WORK_SESSION_QUERY_KEY, 'current'],
    queryFn: async () => {
      const response = await workSessionService.getCurrentWorkSession()
      const data = response.data.data
      if (!data) return null
      return mapWorkSessionPlaceResponseToWorkSession(data)
    },
  })
}

export function useStartWorkSession() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: StartWorkSessionRequestDTO) => {
      const response = await workSessionService.start(data)
      return mapWorkSessionResponseToWorkSession(response.data.data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [WORK_SESSION_QUERY_KEY, 'current'],
      })
    },
  })
}

export function useUpdateActiveWorkSession() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: UpdateWorkSessionRequestDTO) => {
      const response = await workSessionService.updateActive(data)
      return mapWorkSessionResponseToWorkSession(response.data.data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [WORK_SESSION_QUERY_KEY, 'current'],
      })
    },
  })
}

export function useEndWorkSession() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, userId }: { id: string; userId: string }) => {
      const response = await workSessionService.end(id, userId)
      return mapWorkSessionResponseToWorkSession(response.data.data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [WORK_SESSION_QUERY_KEY, 'current'],
      })
    },
  })
}