import { useEffect, useState } from 'react'

/** Re-renders about every 100ms while `active` so elapsed time can be shown live. */
export function useLiveElapsedMs(startedAt: number | null, active: boolean): number {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (!active || startedAt === null) {
      return
    }
    const id = window.setInterval(() => {
      setNow(Date.now())
    }, 100)
    return () => {
      window.clearInterval(id)
    }
  }, [active, startedAt])

  if (startedAt === null) {
    return 0
  }
  return Math.max(0, now - startedAt)
}
