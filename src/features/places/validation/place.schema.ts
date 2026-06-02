import { z } from 'zod'

export const placeSchema = z.object({
  name: z
    .string()
    .min(1, 'Place name is required')
    .min(2, 'Place name must be at least 2 characters')
    .max(100, 'Place name cannot exceed 100 characters'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(500, 'Description cannot exceed 500 characters'),
  latitude: z.number().min(-90, 'Latitude must be between -90 and 90').max(90, 'Latitude must be between -90 and 90'),
  longitude: z.number().min(-180, 'Longitude must be between -180 and 180').max(180, 'Longitude must be between -180 and 180'),
  radiusMeters: z.number().min(20, 'Radius must be at least 20 meters').max(5000, 'Radius cannot exceed 5000 meters'),
})

export type PlaceFormData = z.infer<typeof placeSchema>
