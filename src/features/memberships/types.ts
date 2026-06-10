export type InvitationCodeStatus = 'active' | 'expired' | 'exhausted'

export interface GenerateInvitationCodeRequestDTO {
  organizationId: string
  expiresAt?: string
  maxUses?: number
}
