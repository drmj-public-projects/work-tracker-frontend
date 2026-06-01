import { z } from 'zod'

export const createOrganizationSchema = z.object({
  name: z
    .string()
    .min(1, 'Organization name is required')
    .min(2, 'Organization name must be at least 2 characters')
    .max(100, 'Organization name cannot exceed 100 characters'),
})

export type CreateOrganizationFormData = z.infer<typeof createOrganizationSchema>
