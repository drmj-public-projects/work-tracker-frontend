import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal } from '@/shared/components/Modal'
import { Input } from '@/shared/components/Input'
import { hourlyRateSchema, type HourlyRateFormData } from '../validation/hourly-rate.schema'

interface AssignRateModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: HourlyRateFormData) => void
  isSubmitting: boolean
  employeeName: string
  initialData?: {
    rate: number
    validFrom: string
    validTo: string | null
  } | null
}

export function AssignRateModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  employeeName,
  initialData,
}: AssignRateModalProps) {
  const { t } = useTranslation('auth')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<HourlyRateFormData>({
    resolver: zodResolver(hourlyRateSchema),
    defaultValues: {
      rate: initialData?.rate ?? undefined,
      validFrom: initialData?.validFrom ?? new Date().toISOString().slice(0, 16),
      validTo: initialData?.validTo ?? null,
    },
  })

  useEffect(() => {
    if (isOpen) {
      reset({
        rate: initialData?.rate ?? undefined,
        validFrom: initialData?.validFrom ?? new Date().toISOString().slice(0, 16),
        validTo: initialData?.validTo ?? null,
      })
    }
  }, [isOpen, initialData, reset])

  const title = initialData
    ? t('hourlyRates.modal.editTitle')
    : t('hourlyRates.modal.assignTitle')
  const description = t('hourlyRates.modal.description', { name: employeeName })

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={description}
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
          >
            {t('hourlyRates.modal.cancel')}
          </button>
          <button
            type="button"
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isSubmitting
              ? t('hourlyRates.modal.saving')
              : initialData
                ? t('hourlyRates.modal.save')
                : t('hourlyRates.modal.assign')}
          </button>
        </>
      }
    >
      <form className="space-y-4">
        <Input
          label={t('hourlyRates.modal.rateLabel')}
          placeholder={t('hourlyRates.modal.ratePlaceholder')}
          type="number"
          step="0.01"
          min="0.01"
          error={errors.rate?.message}
          {...register('rate', { valueAsNumber: true })}
        />
        <Input
          label={t('hourlyRates.modal.validFromLabel')}
          type="datetime-local"
          error={errors.validFrom?.message}
          {...register('validFrom')}
        />
        <Input
          label={t('hourlyRates.modal.validToLabel')}
          type="datetime-local"
          error={errors.validTo?.message}
          {...register('validTo')}
        />
        <p className="text-xs text-muted-foreground">
          {t('hourlyRates.modal.validToHint')}
        </p>
      </form>
    </Modal>
  )
}
