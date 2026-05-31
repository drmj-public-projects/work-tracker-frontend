import type { WorkSessionResponseDTO } from '@/features/work-sessions/dto/response/work-session.response.dto'

export interface PageDTO<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
  first: boolean
  last: boolean
}

export interface WorkSessionDetailResponseDTO {
  content: WorkSessionResponseDTO[]
  totalElements: number
  totalPages: number
  number: number
  size: number
  first: boolean
  last: boolean
}
