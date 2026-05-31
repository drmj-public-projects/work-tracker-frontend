import { useEffect } from 'react'
import { useAuthStore } from '@/shared/store/authStore'
import { organizationService } from '@/features/organizations/services/organization.service'
import { mapOrganizationSettingsResponseToOrganizationSettings } from '@/features/organizations/mappers/organization-settings.mapper'

export function DashboardPage() {
  const selectedOrganizationId = useAuthStore((state) => state.selectedOrganizationId)
  const organizationSettings = useAuthStore((state) => state.organizationSettings)
  const setOrganizationSettings = useAuthStore((state) => state.setOrganizationSettings)

  useEffect(() => {
    if (selectedOrganizationId && !organizationSettings) {
      organizationService
        .getSettings(selectedOrganizationId)
        .then((response) => {
          const settings = mapOrganizationSettingsResponseToOrganizationSettings(
            response.data.data
          )
          setOrganizationSettings(settings)
        })
        .catch(() => {
          // Silently ignore; settings are not critical for dashboard rendering
        })
    }
  }, [selectedOrganizationId, organizationSettings, setOrganizationSettings])

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-4">Dashboard</h1>
      <p className="text-muted-foreground">Coming soon!</p>
    </div>
  )
}
