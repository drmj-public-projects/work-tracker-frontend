import { z } from 'zod'

export const createOrganizationSchema = z.object({
  name: z
    .string()
    .min(1, 'createOrganization.validation.nameRequired')
    .min(2, 'createOrganization.validation.nameMin')
    .max(100, 'createOrganization.validation.nameMax'),
  timeZone: z
    .string()
    .min(1, 'createOrganization.validation.timeZoneRequired'),
})

export type CreateOrganizationFormData = z.infer<typeof createOrganizationSchema>
