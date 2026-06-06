import { useCallback, useMemo, useEffect, useState } from 'react'
import {
  MapContainer,
  TileLayer,
  Marker,
  Circle,
  useMapEvents,
  useMap,
} from 'react-leaflet'
import { Icon, type LatLngExpression } from 'leaflet'

const FALLBACK_CENTER = { lat: 19.4326, lng: -99.1332 } // Mexico City

// Self-hosted Leaflet marker images (copied to public/leaflet/)
const defaultIcon = new Icon({
  iconUrl: '/leaflet/marker-icon.png',
  iconRetinaUrl: '/leaflet/marker-icon-2x.png',
  shadowUrl: '/leaflet/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

interface PlaceMapPickerProps {
  latitude: number
  longitude: number
  radiusMeters: number
  onLocationChange: (lat: number, lng: number) => void
  useGeolocation?: boolean
}

function MapClickHandler({
  onLocationChange,
}: {
  onLocationChange: (lat: number, lng: number) => void
}) {
  useMapEvents({
    click(e) {
      onLocationChange(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

function MapViewUpdater({ center }: { center: LatLngExpression }) {
  const map = useMap()
  useEffect(() => {
    map.setView(center, map.getZoom())
  }, [center, map])
  return null
}

function useGeolocation(onReady?: (lat: number, lng: number) => void) {
  const [center, setCenter] = useState<LatLngExpression>([FALLBACK_CENTER.lat, FALLBACK_CENTER.lng])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!navigator.geolocation) {
      setReady(true)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude
        setCenter([lat, lng])
        onReady?.(lat, lng)
        setReady(true)
      },
      () => {
        setReady(true)
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 600000 }
    )
  }, [])

  return { center, ready }
}

export function PlaceMapPicker({
  latitude,
  longitude,
  radiusMeters,
  onLocationChange,
  useGeolocation: shouldUseGeolocation = false,
}: PlaceMapPickerProps) {
  const isAtOrigin = latitude === 0 && longitude === 0

  const { center: geolocationCenter, ready: geolocationReady } = useGeolocation(
    shouldUseGeolocation && isAtOrigin ? onLocationChange : undefined
  )

  const displayCenter: LatLngExpression = useMemo(() => {
    if (shouldUseGeolocation && isAtOrigin && geolocationReady) {
      return geolocationCenter
    }
    return [latitude, longitude]
  }, [latitude, longitude, shouldUseGeolocation, isAtOrigin, geolocationCenter, geolocationReady])

  const handleMarkerDrag = useCallback(
    (e: { target: { getLatLng: () => { lat: number; lng: number } } }) => {
      const position = e.target.getLatLng()
      onLocationChange(position.lat, position.lng)
    },
    [onLocationChange]
  )

  // Key to force stable remount under React StrictMode
  const mapKey = useMemo(() => {
    const [lat, lng] = displayCenter as [number, number]
    return `${lat}-${lng}-${radiusMeters}`
  }, [displayCenter, radiusMeters])

  return (
    <div className="w-full h-full min-h-[400px] rounded-xl overflow-hidden border border-border">
      <MapContainer
        key={mapKey}
        center={displayCenter}
        zoom={13}
        scrollWheelZoom={true}
        style={{ width: '100%', height: '100%', minHeight: '400px' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler onLocationChange={onLocationChange} />
        <MapViewUpdater center={displayCenter} />
        <Marker
          position={displayCenter}
          icon={defaultIcon}
          draggable={true}
          eventHandlers={{
            dragend: handleMarkerDrag,
          }}
        />
        <Circle
          center={displayCenter}
          radius={radiusMeters}
          pathOptions={{
            color: '#2670df',
            fillColor: '#2670df',
            fillOpacity: 0.15,
            weight: 2,
          }}
        />
      </MapContainer>
    </div>
  )
}
