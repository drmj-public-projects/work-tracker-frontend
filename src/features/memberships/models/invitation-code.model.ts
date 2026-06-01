export interface InvitationCode {
  id: string
  organizationId: string
  code: string
  role: string
  expiresAt: Date | null
  maxUses: number
  currentUses: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}
