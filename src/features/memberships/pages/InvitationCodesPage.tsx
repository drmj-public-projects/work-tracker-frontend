import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Loader2 } from 'lucide-react'
import { useAuthStore } from '@/shared/store/authStore'
import { useInvitationCodes } from '../hooks/useInvitationCodes'
import { useInvitationCodeStats } from '../hooks/useInvitationCodeStats'
import { useRevokeInvitationCode } from '../hooks/useRevokeInvitationCode'
import { useInvitationCodeStore } from '../store/invitationCodeStore'
import { InvitationCodesHeader } from '../components/InvitationCodesHeader'
import { InvitationCodesStats } from '../components/InvitationCodesStats'
import { InvitationCodesTable } from '../components/InvitationCodesTable'
import { GenerateCodeModal } from '../components/GenerateCodeModal'
import { Pagination } from '@/shared/components/Pagination'

export function InvitationCodesPage() {
  const { t } = useTranslation('auth')
  const selectedOrganizationId = useAuthStore((s) => s.selectedOrganizationId)
  const setGenerateModalOpen = useInvitationCodeStore((s) => s.setGenerateModalOpen)

  const [page, setPage] = useState(0)
  const size = 10

  const {
    data: codesPage,
    isLoading: isLoadingCodes,
    isError: isCodesError,
  } = useInvitationCodes(selectedOrganizationId, page, size)

  const {
    data: stats,
    isLoading: isLoadingStats,
  } = useInvitationCodeStats(selectedOrganizationId)

  const revokeMutation = useRevokeInvitationCode(selectedOrganizationId)

  const handleGenerateClick = () => {
    setGenerateModalOpen(true)
  }

  const handleRevoke = (codeId: string) => {
    revokeMutation.mutate(codeId)
  }

  if (isLoadingCodes || isLoadingStats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground text-sm">{t('invitationCodes.loading')}</p>
        </div>
      </div>
    )
  }

  if (isCodesError) {
    return (
      <div className="p-4">
        <p className="text-destructive">{t('invitationCodes.error')}</p>
      </div>
    )
  }

  return (
    <div>
      <InvitationCodesHeader onGenerateClick={handleGenerateClick} />
      <InvitationCodesStats stats={stats ?? null} />

      <div className="bg-card border border-border rounded-xl p-4 mb-4">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          {t('invitationCodes.activePool')}
        </h2>
        <InvitationCodesTable
          codes={codesPage?.content ?? []}
          onRevoke={handleRevoke}
          isRevoking={revokeMutation.isPending}
        />
      </div>

      {codesPage && codesPage.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {t('invitationCodes.showing', {
              from: codesPage.number * codesPage.size + 1,
              to: Math.min((codesPage.number + 1) * codesPage.size, codesPage.totalElements),
              total: codesPage.totalElements,
            })}
          </p>
          <Pagination
            currentPage={codesPage.number}
            totalPages={codesPage.totalPages}
            onPageChange={setPage}
          />
        </div>
      )}

      <GenerateCodeModal />
    </div>
  )
}
