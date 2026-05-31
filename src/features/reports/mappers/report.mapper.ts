import type { WorkSessionSummaryResponseDTO, WorkSessionSummaryBlockDTO } from '../dto/response/work-session-summary.response.dto'
import type { SummaryBlock, WorkSessionSummary } from '../models/work-session-summary.model'
import type { WorkSessionResponseDTO } from '@/features/work-sessions/dto/response/work-session.response.dto'
import type { WorkSession } from '@/features/work-sessions/models/work-session.model'
import type { WorkSessionDetailResponseDTO } from '../dto/response/work-session-detail.response.dto'

export function mapSummaryBlockDTOToSummaryBlock(dto: WorkSessionSummaryBlockDTO): SummaryBlock {
  return {
    periodLabel: dto.periodLabel,
    totalSessions: dto.totalSessions,
    totalMinutes: dto.totalMinutes,
    totalPay: dto.totalPay,
    timerMinutes: dto.timerMinutes,
    timerPay: dto.timerPay,
    manualMinutes: dto.manualMinutes,
    manualPay: dto.manualPay,
  }
}

export function mapSummaryResponseDTOToWorkSessionSummary(dto: WorkSessionSummaryResponseDTO): WorkSessionSummary {
  return {
    placeId: dto.placeId,
    placeName: dto.placeName,
    groupBy: dto.groupBy,
    range: dto.range,
    summaryBlocks: dto.summaryBlocks.map(mapSummaryBlockDTOToSummaryBlock),
  }
}

export function mapWorkSessionResponseDTOToWorkSession(dto: WorkSessionResponseDTO): WorkSession {
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

export function mapDetailResponseDTOToPage(dto: WorkSessionDetailResponseDTO): {
  sessions: WorkSession[]
  totalElements: number
  totalPages: number
  number: number
  size: number
  first: boolean
  last: boolean
} {
  return {
    sessions: dto.content.map(mapWorkSessionResponseDTOToWorkSession),
    totalElements: dto.totalElements,
    totalPages: dto.totalPages,
    number: dto.number,
    size: dto.size,
    first: dto.first,
    last: dto.last,
  }
}
