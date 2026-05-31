import type { WorkSessionResponseDTO } from '../dto/response/work-session.response.dto'
import type { WorkSessionPlaceResponseDTO } from '../dto/response/work-session-place.response.dto'
import type { WorkSession } from '../models/work-session.model'

export function mapWorkSessionResponseToWorkSession(dto: WorkSessionResponseDTO): WorkSession {
  return {
    id: dto.id,
    userId: dto.userId,
    organizationId: dto.organizationId,
    place: {
      id: dto.placeId,
      name: '',
      description: undefined,
    },
    startTime: dto.startTime,
    endTime: dto.endTime,
    durationMinutes: dto.durationMinutes,
    breakMinutes: dto.breakMinutes,
    hourlyRate: dto.hourlyRate,
    totalPay: dto.totalPay,
    notes: dto.notes,
    status: dto.status,
    entryType: dto.entryType,
    source: dto.source,
  }
}

export function mapWorkSessionPlaceResponseToWorkSession(dto: WorkSessionPlaceResponseDTO): WorkSession {
  return {
    id: dto.id,
    userId: dto.userId,
    organizationId: dto.organizationId,
    place: {
      id: dto.placeId,
      name: dto.placeName,
      description: undefined,
    },
    startTime: dto.startTime,
    endTime: dto.endTime,
    durationMinutes: dto.durationMinutes,
    breakMinutes: dto.breakMinutes,
    hourlyRate: dto.hourlyRate,
    totalPay: dto.totalPay,
    notes: dto.notes,
    status: dto.status,
    entryType: dto.entryType,
    source: dto.source,
  }
}