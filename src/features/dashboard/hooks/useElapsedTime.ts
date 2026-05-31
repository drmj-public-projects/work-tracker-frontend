import { useState, useEffect } from 'react'

export function useElapsedTime(startTime?: string) {
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    if (!startTime) return
    const start = new Date(startTime).getTime()

    const update = () => {
      setElapsed(Math.floor((Date.now() - start) / 1000))
    }

    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [startTime])

  return elapsed
}
