import { z } from 'zod'

export const hourlyRateSchema = z.object({
  rate: z.number().min(0.01, 'Rate must be at least 0.01'),
  validFrom: z.string().min(1, 'Valid from is required'),
  validTo: z.string().nullable().optional(),
})

export type HourlyRateFormData = z.infer<typeof hourlyRateSchema>
