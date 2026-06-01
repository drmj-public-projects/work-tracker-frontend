export interface InvitationCodeResponseDTO {
  id: string
  organizationId: string
  code: string
  role: string
  expiresAt: string | null
  maxUses: number
  currentUses: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}
