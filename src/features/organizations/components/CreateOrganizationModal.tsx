import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Building2, Loader2 } from 'lucide-react'
import { Modal } from '@/shared/components/Modal'
import { Input } from '@/shared/components/Input'
import {
  createOrganizationSchema,
  type CreateOrganizationFormData,
} from '../validation/create-organization.schema'
import { organizationService } from '../services/organization.service'
import { mapOrganizationSettingsResponseToOrganizationSettings } from '../mappers/organization-settings.mapper'
import { useAuthStore } from '@/shared/store/authStore'
import { useNavigate } from 'react-router-dom'

interface CreateOrganizationModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CreateOrganizationModal({ isOpen, onClose }: CreateOrganizationModalProps) {
  const { t } = useTranslation('auth')
  const navigate = useNavigate()
  const selectOrganization = useAuthStore((state) => state.selectOrganization)
  const [isCreating, setIsCreating] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateOrganizationFormData>({
    resolver: zodResolver(createOrganizationSchema),
  })

  const onSubmit = async (data: CreateOrganizationFormData) => {
    setCreateError(null)
    setIsCreating(true)
    try {
      const response = await organizationService.create({ name: data.name })
      const org = response.data.data

      await selectOrganization({ organizationId: org.id }, org.name)

      const settingsResponse = await organizationService.getSettings(org.id)
      const settings = mapOrganizationSettingsResponseToOrganizationSettings(
        settingsResponse.data.data
      )
      useAuthStore.getState().setOrganizationSettings(settings)

      reset()
      onClose()
      navigate('/dashboard')
    } catch {
      setCreateError(t('createOrganization.error'))
      setIsCreating(false)
    }
  }

  const handleClose = () => {
    setCreateError(null)
    reset()
    onClose()
  }

  const footer = (
    <>
      <button
        type="button"
        onClick={handleClose}
        disabled={isCreating}
        className="h-[var(--button-height-md)] px-5 rounded-lg font-medium text-sm border border-border bg-background text-foreground hover:bg-muted transition-all disabled:opacity-40"
      >
        {t('createOrganization.cancel')}
      </button>
      <button
        type="submit"
        form="create-organization-form"
        disabled={isCreating}
        className="h-[var(--button-height-md)] px-5 rounded-lg font-medium text-sm bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-active transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {isCreating && <Loader2 className="w-4 h-4 animate-spin" />}
        {t('createOrganization.create')}
      </button>
    </>
  )

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={t('createOrganization.title')}
      description={t('createOrganization.desc')}
      footer={footer}
    >
      <form id="create-organization-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label={t('createOrganization.nameLabel')}
          icon={<Building2 className="w-5 h-5" />}
          placeholder={t('createOrganization.namePlaceholder')}
          error={errors.name?.message}
          disabled={isCreating}
          {...register('name')}
        />
        {createError && (
          <p className="text-sm text-destructive">{createError}</p>
        )}
      </form>
    </Modal>
  )
}
