import { useTranslation } from 'react-i18next'
import { Plus } from 'lucide-react'
import { useAuthStore } from '@/shared/store/authStore'
import { useHasRole } from '@/shared/hooks/useHasRole'
import { usePlaces } from '../hooks/usePlaces'
import { PlaceCard } from '../components/PlaceCard'
import { CreatePlaceCard } from '../components/CreatePlaceCard'
import { UserOrganizationRole } from '@/shared/types/user-organization-role.enum'

export function PlacesPage() {
  const { t } = useTranslation('auth')
  const selectedOrganizationId = useAuthStore(
    (state) => state.selectedOrganizationId
  )
  const canCreate = useHasRole(UserOrganizationRole.ADMIN, UserOrganizationRole.EMPLOYER)

  const { data: places, isLoading, error } = usePlaces(selectedOrganizationId || '')

  return (
    <div className="h-full flex flex-col">

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {t('places.title')}
          </h1>
          <p className="text-muted-foreground">
            {t('places.subtitle')}
          </p>
        </div>
        {canCreate && (
          <button
            type="button"
            className="h-[var(--button-height-md)] px-6 bg-primary text-primary-foreground rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-primary-hover active:bg-primary-active transition-all shrink-0"
          >
            <Plus className="w-5 h-5" />
            {t('places.createPlace')}
          </button>
        )}
      </div>

      {isLoading && (
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-3 text-muted-foreground">
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            {t('places.loading')}
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center mb-6">
          {t('places.error')}
        </div>
      )}

      {!isLoading && !error && places?.length === 0 && (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground text-lg">
            {t('places.noPlaces')}
          </p>
        </div>
      )}

      {!isLoading && !error && places && places.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {places.map((place) => (
            <PlaceCard key={place.id} place={place} canEdit={canCreate} />
          ))}
          {canCreate && <CreatePlaceCard />}
        </div>
      )}
    </div>
  )
}
