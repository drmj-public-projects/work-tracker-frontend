import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { Building2 } from 'lucide-react'
import { useAuthStore } from '@/shared/store/authStore'
import { useToast } from '@/shared/hooks/useToast'
import { usePlaceById, useUpdatePlace } from '../hooks/usePlaces'
import { PlaceForm } from '../components/PlaceForm'
import type { PlaceFormData } from '../validation/place.schema'

export function EditPlacePage() {
  const { t } = useTranslation('auth')
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const selectedOrganizationId = useAuthStore((state) => state.selectedOrganizationId)

  const { data: place, isLoading } = usePlaceById(id ?? null)
  const updateMutation = useUpdatePlace(selectedOrganizationId)
  const { toastSuccess } = useToast()

  const handleSubmit = (data: PlaceFormData) => {
    if (!id || !selectedOrganizationId) return
    updateMutation.mutate(
      {
        id,
        data: {
          name: data.name,
          description: data.description,
          latitude: data.latitude,
          longitude: data.longitude,
          radiusMeters: data.radiusMeters,
        },
      },
      {
        onSuccess: () => {
          toastSuccess('toast.success.updated')
          navigate('/places')
        },
      }
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground text-sm">{t('editPlace.loading')}</p>
        </div>
      </div>
    )
  }

  if (!place) {
    return (
      <div className="p-4">
        <p className="text-destructive">{t('editPlace.notFound')}</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">{t('editPlace.title')}</h1>
        </div>
        <p className="text-muted-foreground">{t('editPlace.subtitle')}</p>
      </div>

      <PlaceForm
        initialValues={{
          name: place.name,
          description: place.description,
          latitude: place.latitude,
          longitude: place.longitude,
          radiusMeters: place.radiusMeters,
        }}
        onSubmit={handleSubmit}
        isSubmitting={updateMutation.isPending}
        submitLabel={t('editPlace.submit')}
        useGeolocation={false}
      />
    </div>
  )
}
