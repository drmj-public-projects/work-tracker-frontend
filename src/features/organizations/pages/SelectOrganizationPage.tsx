import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Building2, Plus, ArrowRight, Users } from 'lucide-react'
import { useAuthStore } from '@/shared/store/authStore'
import { useOrganizations } from '@/features/organizations/hooks/useOrganizations'
import { organizationService } from '@/features/organizations/services/organization.service'
import { mapOrganizationSettingsResponseToOrganizationSettings } from '@/features/organizations/mappers/organization-settings.mapper'
import type { Organization } from '@/features/auth/models/organization.model'

export function SelectOrganizationPage() {
  const { t } = useTranslation('auth')
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const selectOrganization = useAuthStore((state) => state.selectOrganization)

  const { data: organizations, isLoading } = useOrganizations()

  const [isSelecting, setIsSelecting] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSelectOrg = async (org: Organization) => {
    setError(null)
    setIsSelecting(org.id)
    try {
      await selectOrganization({ organizationId: org.id }, org.name)
      const settingsResponse = await organizationService.getSettings(org.id)
      const settings = mapOrganizationSettingsResponseToOrganizationSettings(
        settingsResponse.data.data
      )
      useAuthStore.getState().setOrganizationSettings(settings)
      navigate('/dashboard')
    } catch {
      setError(t('selectOrganization.error'))
      setIsSelecting(null)
    }
  }

  const userName = user?.name?.split(' ')[0] || t('userMenu.guest')

  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-4xl text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">{t('selectOrganization.loading')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-foreground mb-3">
            {t('selectOrganization.welcome')}, {userName}
          </h1>
          <p className="text-muted-foreground text-lg">
            {t('selectOrganization.subtitle')}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {organizations?.map((org) => (
            <div
              key={org.id}
              className="bg-card rounded-2xl border border-border p-6 hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <Building2 className="w-6 h-6 text-primary" />
              </div>

              <h3 className="text-lg font-semibold text-foreground mb-1">
                {org.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-2">Organization</p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-6">
                <Users className="w-3 h-3" />
                <span>
                  {org.memberCount} {org.memberCount === 1 ? 'member' : 'members'}
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleSelectOrg(org)}
                disabled={isSelecting === org.id}
                className="mt-auto w-full h-[var(--button-height-md)] bg-primary text-primary-foreground rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-primary-hover active:bg-primary-active transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSelecting === org.id ? (
                  'Loading...'
                ) : (
                  <>
                    {t('selectOrganization.selectOrganization')}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          ))}

          <button
            type="button"
            className="bg-card rounded-2xl border border-dashed border-border p-6 hover:border-primary hover:bg-primary/5 transition-all flex flex-col items-center justify-center text-center min-h-[200px]"
          >
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
              <Plus className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">
              {t('selectOrganization.createOrganization')}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t('selectOrganization.createDescription')}
            </p>
          </button>
        </div>

        {(!organizations || organizations.length === 0) && (
          <div className="text-center mt-8">
            <p className="text-muted-foreground">
              {t('selectOrganization.noOrganizations')}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}