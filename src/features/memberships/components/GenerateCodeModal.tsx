import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Calendar, Hash, Loader2 } from 'lucide-react'
import { Modal } from '@/shared/components/Modal'
import { Input } from '@/shared/components/Input'
import { toISOStringWithTimeZone } from '@/shared/utils/time-formatters'
import { generateCodeSchema, type GenerateCodeFormData } from '../validation/generate-code.schema'
import { useAuthStore } from '@/shared/store/authStore'
import { useGenerateInvitationCode } from '../hooks/useGenerateInvitationCode'
import { useInvitationCodeStore } from '../store/invitationCodeStore'

export function GenerateCodeModal() {
  const { t } = useTranslation('auth')
  const selectedOrganizationId = useAuthStore((s) => s.selectedOrganizationId)
  const isOpen = useInvitationCodeStore((s) => s.isGenerateModalOpen)
  const setOpen = useInvitationCodeStore((s) => s.setGenerateModalOpen)

  const generateMutation = useGenerateInvitationCode(selectedOrganizationId)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GenerateCodeFormData>({
    resolver: zodResolver(generateCodeSchema),
    defaultValues: {
      maxUses: 1,
    },
  })

  const onSubmit = (data: GenerateCodeFormData) => {
    if (!selectedOrganizationId) return
    const timeZone = useAuthStore.getState().organizationSettings?.timeZone || 'UTC'
    generateMutation.mutate(
      {
        organizationId: selectedOrganizationId,
        expiresAt: data.expiresAt ? toISOStringWithTimeZone(data.expiresAt, timeZone) : undefined,
        maxUses: data.maxUses,
      },
      {
        onSuccess: () => {
          reset()
          setOpen(false)
        },
      }
    )
  }

  const handleClose = () => {
    reset()
    setOpen(false)
  }

  const footer = (
    <>
      <button
        type="button"
        onClick={handleClose}
        className="h-[var(--button-height-md)] px-5 rounded-lg font-medium text-sm border border-border bg-background text-foreground hover:bg-muted transition-all"
      >
        {t('invitationCodes.generateModal.cancel')}
      </button>
      <button
        type="submit"
        form="generate-code-form"
        disabled={generateMutation.isPending}
        className="h-[var(--button-height-md)] px-5 rounded-lg font-medium text-sm bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-active transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {generateMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
        {t('invitationCodes.generateModal.generate')}
      </button>
    </>
  )

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={t('invitationCodes.generateModal.title')}
      description={t('invitationCodes.generateModal.desc')}
      footer={footer}
    >
      <form id="generate-code-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label={t('invitationCodes.generateModal.expiresAt')}
          icon={<Calendar className="w-5 h-5" />}
          type="datetime-local"
          error={errors.expiresAt?.message}
          {...register('expiresAt')}
        />
        <Input
          label={t('invitationCodes.generateModal.maxUses')}
          icon={<Hash className="w-5 h-5" />}
          type="number"
          min={1}
          max={100}
          error={errors.maxUses?.message}
          {...register('maxUses', { valueAsNumber: true })}
        />
        {generateMutation.isError && (
          <p className="text-sm text-destructive">
            {t('invitationCodes.generateModal.error')}
          </p>
        )}
      </form>
    </Modal>
  )
}
