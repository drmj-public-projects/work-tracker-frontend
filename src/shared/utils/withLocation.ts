export function withLocation(
  requiresLocation: boolean,
  onComplete: (latitude?: number, longitude?: number) => void
) {
  if (requiresLocation && 'geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        onComplete(position.coords.latitude, position.coords.longitude)
      },
      () => {
        onComplete()
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  } else {
    onComplete()
  }
}
