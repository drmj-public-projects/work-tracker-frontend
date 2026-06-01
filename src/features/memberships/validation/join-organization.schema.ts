import { z } from 'zod'

export const joinOrganizationSchema = z.object({
  invitationCode: z
    .string()
    .min(1, 'Invitation code is required')
    .min(4, 'Invitation code must be at least 4 characters'),
})

export type JoinOrganizationFormData = z.infer<typeof joinOrganizationSchema>
