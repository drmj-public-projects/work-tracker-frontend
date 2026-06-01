import { z } from 'zod'

export const generateCodeSchema = z.object({
  expiresAt: z.string().optional().or(z.literal('')),
  maxUses: z.number().min(1).max(100),
})

export type GenerateCodeFormData = z.infer<typeof generateCodeSchema>
