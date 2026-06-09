import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { MapPin, Pencil, Building2, ExternalLink } from 'lucide-react'
import { useFormattedDate } from '@/shared/hooks/useFormattedDate'
import type { Place } from '../models/place.model'

interface PlaceCardProps {
  place: Place
  canEdit?: boolean
}

export function PlaceCard({ place, canEdit = false }: PlaceCardProps) {
  const { t } = useTranslation('auth')
  const navigate = useNavigate()
  const { formatDate } = useFormattedDate()

  const formattedDate = formatDate(place.createdAt)

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${place.latitude},${place.longitude}`

  return (
    <div className="bg-card rounded-2xl border border-border p-6 hover:shadow-md transition-shadow flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
          <Building2 className="w-6 h-6 text-primary" />
        </div>
        <button
          type="button"
          className="p-2 rounded-lg hover:bg-muted transition-colors"
        >
          <span className="sr-only">{t('places.options')}</span>
          <svg
            className="w-5 h-5 text-muted-foreground"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <circle cx="12" cy="6" r="2" />
            <circle cx="12" cy="12" r="2" />
            <circle cx="12" cy="18" r="2" />
          </svg>
        </button>
      </div>

      <h3 className="text-lg font-semibold text-foreground mb-1">
        {place.name}
      </h3>
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-6 group"
      >
        <MapPin className="w-4 h-4" />
        <span>
          {t('places.openLocation')}
        </span>
        <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
      </a>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-muted/50 rounded-xl p-3">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
            {t('places.hourlyRate')}
          </p>
          <p className="text-xl font-bold text-primary">
            {place.hourlyRate > 0 ? `$${place.hourlyRate.toFixed(2)}` : '--'}
          </p>
        </div>
        <div className="bg-muted/50 rounded-xl p-3">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
            {t('places.created')}
          </p>
          <p className="text-sm font-semibold text-foreground">
            {formattedDate}
          </p>
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between pt-4 border-t border-border">
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
            place.isActive
              ? 'bg-success/10 text-success'
              : 'bg-muted text-muted-foreground'
          }`}
        >
          {place.isActive
            ? t('places.status.active')
            : t('places.status.inactive')}
        </span>
        {canEdit && (
          <button
            type="button"
            onClick={() => navigate(`/places/${place.id}/edit`)}
            className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-hover transition-colors"
          >
            <Pencil className="w-4 h-4" />
            {t('places.edit')}
          </button>
        )}
      </div>
    </div>
  )
}
