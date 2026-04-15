/** Screen Wake Lock singleton — browser may release when tab is hidden. */

let sentinel: WakeLockSentinel | null = null

export function isScreenWakeLockSupported(): boolean {
  return typeof navigator !== 'undefined' && 'wakeLock' in navigator && navigator.wakeLock !== undefined
}

export async function acquireScreenWakeLock(): Promise<boolean> {
  if (!isScreenWakeLockSupported()) {
    return false
  }
  await releaseScreenWakeLock()
  try {
    const api = navigator.wakeLock
    if (!api) {
      return false
    }
    sentinel = await api.request('screen')
    return true
  } catch {
    return false
  }
}

export async function releaseScreenWakeLock(): Promise<void> {
  if (sentinel === null) {
    return
  }
  try {
    await sentinel.release()
  } catch {
    // Already released by the browser
  }
  sentinel = null
}
