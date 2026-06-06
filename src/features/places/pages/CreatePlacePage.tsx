import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Building2 } from 'lucide-react'
import { useAuthStore } from '@/shared/store/authStore'
import { useCreatePlace } from '../hooks/usePlaces'
import { PlaceForm } from '../components/PlaceForm'
import type { PlaceFormData } from '../validation/place.schema'

export function CreatePlacePage() {
  const { t } = useTranslation('auth')
  const navigate = useNavigate()
  const selectedOrganizationId = useAuthStore((state) => state.selectedOrganizationId)

  const createMutation = useCreatePlace()

  const handleSubmit = (data: PlaceFormData) => {
    if (!selectedOrganizationId) return
    createMutation.mutate(
      {
        organizationId: selectedOrganizationId,
        name: data.name,
        description: data.description,
        latitude: data.latitude,
        longitude: data.longitude,
        radiusMeters: data.radiusMeters,
      },
      {
        onSuccess: () => {
          navigate('/places')
        },
      }
    )
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">{t('createPlace.title')}</h1>
        </div>
        <p className="text-muted-foreground">{t('createPlace.subtitle')}</p>
      </div>

      <PlaceForm
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending}
        submitLabel={t('createPlace.submit')}
        useGeolocation={true}
      />
    </div>
  )
}
