import { useEffect, useState } from 'react'

/** Counts down wall-clock time left when a demo time limit is set (updates ~1/s). */
export function useDemoRemainingMs(
  sessionStartedAt: number | null,
  timeLimitMinutes: number,
  active: boolean,
): number {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (!active || sessionStartedAt === null || timeLimitMinutes <= 0) {
      return
    }
    const id = window.setInterval(() => {
      setNow(Date.now())
    }, 1000)
    return () => {
      window.clearInterval(id)
    }
  }, [active, sessionStartedAt, timeLimitMinutes])

  if (sessionStartedAt === null || timeLimitMinutes <= 0) {
    return 0
  }
  const budget = timeLimitMinutes * 60 * 1000
  return Math.max(0, budget - (now - sessionStartedAt))
}
