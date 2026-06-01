import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Ticket, Loader2 } from 'lucide-react'
import { Modal } from '@/shared/components/Modal'
import { Input } from '@/shared/components/Input'
import {
  joinOrganizationSchema,
  type JoinOrganizationFormData,
} from '@/features/memberships/validation/join-organization.schema'
import { membershipService } from '@/features/memberships/services/membership.service'
import { mapMembershipResponseToMembership } from '@/features/memberships/mappers/membership.mapper'
import { useAuthStore } from '@/shared/store/authStore'
import { organizationService } from '@/features/organizations/services/organization.service'
import { mapOrganizationSettingsResponseToOrganizationSettings } from '@/features/organizations/mappers/organization-settings.mapper'
import { useNavigate } from 'react-router-dom'

interface JoinOrganizationModalProps {
  isOpen: boolean
  onClose: () => void
}

export function JoinOrganizationModal({ isOpen, onClose }: JoinOrganizationModalProps) {
  const { t } = useTranslation('auth')
  const navigate = useNavigate()
  const selectOrganization = useAuthStore((state) => state.selectOrganization)
  const [isJoining, setIsJoining] = useState(false)
  const [joinError, setJoinError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<JoinOrganizationFormData>({
    resolver: zodResolver(joinOrganizationSchema),
  })

  const onSubmit = async (data: JoinOrganizationFormData) => {
    setJoinError(null)
    setIsJoining(true)
    try {
      const response = await membershipService.joinOrganization({
        invitationCode: data.invitationCode,
      })
      const membership = mapMembershipResponseToMembership(response.data.data)

      await selectOrganization(
        { organizationId: membership.organizationId },
        membership.organizationName
      )

      const settingsResponse = await organizationService.getSettings(
        membership.organizationId
      )
      const settings = mapOrganizationSettingsResponseToOrganizationSettings(
        settingsResponse.data.data
      )
      useAuthStore.getState().setOrganizationSettings(settings)

      reset()
      onClose()
      navigate('/dashboard')
    } catch {
      setJoinError(t('joinOrganization.error'))
      setIsJoining(false)
    }
  }

  const handleClose = () => {
    setJoinError(null)
    reset()
    onClose()
  }

  const footer = (
    <>
      <button
        type="button"
        onClick={handleClose}
        disabled={isJoining}
        className="h-[var(--button-height-md)] px-5 rounded-lg font-medium text-sm border border-border bg-background text-foreground hover:bg-muted transition-all disabled:opacity-40"
      >
        {t('joinOrganization.cancel')}
      </button>
      <button
        type="submit"
        form="join-organization-form"
        disabled={isJoining}
        className="h-[var(--button-height-md)] px-5 rounded-lg font-medium text-sm bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-active transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {isJoining && <Loader2 className="w-4 h-4 animate-spin" />}
        {t('joinOrganization.join')}
      </button>
    </>
  )

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={t('joinOrganization.modalTitle')}
      description={t('joinOrganization.modalDesc')}
      footer={footer}
    >
      <form id="join-organization-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label={t('joinOrganization.codeLabel')}
          icon={<Ticket className="w-5 h-5" />}
          placeholder={t('joinOrganization.codePlaceholder')}
          error={errors.invitationCode?.message}
          disabled={isJoining}
          {...register('invitationCode')}
        />
        {joinError && (
          <p className="text-sm text-destructive">{joinError}</p>
        )}
      </form>
    </Modal>
  )
}
