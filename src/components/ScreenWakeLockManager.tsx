import { useEffect } from 'react'

import { acquireScreenWakeLock, releaseScreenWakeLock } from '../lib/screenWakeLock'
import { useTypingStore } from '../store/useTypingStore'

/**
 * Keeps screen wake lock in sync with settings and re-acquires when the tab becomes visible again.
 */
export function ScreenWakeLockManager(): null {
  const enabled = useTypingStore((s) => s.screenWakeLockEnabled)

  useEffect(() => {
    if (!enabled) {
      void releaseScreenWakeLock()
    }
  }, [enabled])

  useEffect(() => {
    const onVisibility = (): void => {
      if (document.visibilityState === 'visible' && useTypingStore.getState().screenWakeLockEnabled) {
        void acquireScreenWakeLock()
      }
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return null
}
