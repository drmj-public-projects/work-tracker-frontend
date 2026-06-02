import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Building2, MapPin, Info, Loader2 } from 'lucide-react'
import { Input } from '@/shared/components/Input'
import { NotesTextarea } from '@/shared/components/NotesTextarea'
import { PlaceMapPicker } from './PlaceMapPicker'
import { placeSchema, type PlaceFormData } from '../validation/place.schema'

interface PlaceFormProps {
  initialValues?: Partial<PlaceFormData>
  onSubmit: (data: PlaceFormData) => void
  isSubmitting: boolean
  submitLabel: string
}

const defaultValues: PlaceFormData = {
  name: '',
  description: '',
  latitude: 0,
  longitude: 0,
  radiusMeters: 20,
}

export function PlaceForm({
  initialValues,
  onSubmit,
  isSubmitting,
  submitLabel,
}: PlaceFormProps) {
  const { t } = useTranslation('auth')
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PlaceFormData>({
    resolver: zodResolver(placeSchema),
    defaultValues: {
      ...defaultValues,
      ...initialValues,
    },
  })

  const latitude = watch('latitude')
  const longitude = watch('longitude')
  const radiusMeters = watch('radiusMeters')

  const handleLocationChange = useCallback(
    (lat: number, lng: number) => {
      setValue('latitude', lat, { shouldValidate: true })
      setValue('longitude', lng, { shouldValidate: true })
    },
    [setValue]
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col lg:flex-row gap-6">
      {/* Left column — Form fields */}
      <div className="lg:w-[40%] space-y-5">
        <Input
          label={t('createPlace.nameLabel') + ' *'}
          icon={<Building2 className="w-5 h-5" />}
          placeholder={t('createPlace.namePlaceholder')}
          error={errors.name?.message}
          disabled={isSubmitting}
          {...register('name')}
        />

        <NotesTextarea
          label={t('createPlace.descriptionLabel') + ' *'}
          placeholder={t('createPlace.descriptionPlaceholder')}
          error={errors.description?.message}
          icon={<Building2 className="w-5 h-5" />}
          rows={4}
          value={watch('description')}
          onChange={(value) => setValue('description', value, { shouldValidate: true })}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label={t('createPlace.latitudeLabel') + ' *'}
            icon={<MapPin className="w-5 h-5" />}
            type="number"
            step="any"
            placeholder="0.0000"
            error={errors.latitude?.message}
            disabled={isSubmitting}
            {...register('latitude', { valueAsNumber: true })}
          />
          <Input
            label={t('createPlace.longitudeLabel') + ' *'}
            icon={<MapPin className="w-5 h-5" />}
            type="number"
            step="any"
            placeholder="0.0000"
            error={errors.longitude?.message}
            disabled={isSubmitting}
            {...register('longitude', { valueAsNumber: true })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            {t('createPlace.radiusLabel')}
          </label>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">{t('createPlace.radiusMin')}</span>
            <span className="text-sm font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded">
              {radiusMeters}m
            </span>
            <span className="text-xs text-muted-foreground">{t('createPlace.radiusMax')}</span>
          </div>
          <input
            type="range"
            min={20}
            max={5000}
            step={10}
            disabled={isSubmitting}
            {...register('radiusMeters', { valueAsNumber: true })}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
          />
          {errors.radiusMeters?.message && (
            <p className="mt-1.5 text-sm text-destructive">{errors.radiusMeters.message}</p>
          )}
        </div>

        <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/5 border border-primary/10">
          <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <p className="text-sm text-foreground">
            {t('createPlace.infoText')}
          </p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-[var(--button-height-md)] rounded-lg font-medium text-sm bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-active transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {submitLabel}
        </button>
      </div>

      {/* Right column — Map */}
      <div className="lg:w-[60%] min-h-[400px] lg:min-h-0">
        <PlaceMapPicker
          latitude={latitude}
          longitude={longitude}
          radiusMeters={radiusMeters}
          onLocationChange={handleLocationChange}
        />
      </div>
    </form>
  )
}
