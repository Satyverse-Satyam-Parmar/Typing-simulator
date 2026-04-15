import { useEffect, useRef } from 'react'

import { useTypingStore } from '../store/useTypingStore'

/**
 * Demo mode: types the active snippet at `msPerChar`.
 * If `demoRepeatEnabled`, loops the snippet until time and/or pass limits are hit (whichever comes first).
 */
export function useTypingEngine(): void {
  const mode = useTypingStore((s) => s.mode)
  const activeSnippetIndex = useTypingStore((s) => s.activeSnippetIndex)
  const msPerChar = useTypingStore((s) => s.msPerChar)
  const demoRepeatEnabled = useTypingStore((s) => s.demoRepeatEnabled)
  const demoTimeLimitMinutes = useTypingStore((s) => s.demoTimeLimitMinutes)
  const demoPassLimit = useTypingStore((s) => s.demoPassLimit)
  const snippets = useTypingStore((s) => s.snippets)
  const runNonce = useTypingStore((s) => s.runNonce)
  const resetDemoRunState = useTypingStore((s) => s.resetDemoRunState)
  const setDemoSessionStartedAt = useTypingStore((s) => s.setDemoSessionStartedAt)
  const setDemoCompletedPasses = useTypingStore((s) => s.setDemoCompletedPasses)
  const incrementDemoCompletedPasses = useTypingStore((s) => s.incrementDemoCompletedPasses)
  const advanceReveal = useTypingStore((s) => s.advanceReveal)
  const setStatus = useTypingStore((s) => s.setStatus)
  const content = snippets[activeSnippetIndex]?.content ?? ''
  const contentRef = useRef(content)

  useEffect(() => {
    contentRef.current = content
  }, [content])

  useEffect(() => {
    if (mode !== 'demo') {
      return
    }

    resetDemoRunState()
    setDemoSessionStartedAt(Date.now())
    setDemoCompletedPasses(0)
    setStatus('typing')

    if (content.length === 0) {
      setStatus('complete')
      return
    }

    const id = window.setInterval(() => {
      const currentContent = contentRef.current
      const store = useTypingStore.getState()
      const len = store.revealedLength

      if (len >= currentContent.length) {
        if (!store.demoRepeatEnabled) {
          window.clearInterval(id)
          store.setStatus('complete')
          return
        }

        store.incrementDemoCompletedPasses()
        const st = useTypingStore.getState()
        const sessionStart = st.demoSessionStartedAt
        const timeMs = st.demoTimeLimitMinutes * 60 * 1000
        const withinTime =
          st.demoTimeLimitMinutes === 0 ||
          (sessionStart !== null && Date.now() - sessionStart < timeMs)
        const withinPasses =
          st.demoPassLimit === 0 || st.demoCompletedPasses < st.demoPassLimit

        if (withinTime && withinPasses) {
          st.resetDemoRunState()
          st.setStatus('typing')
          return
        }

        window.clearInterval(id)
        st.setStatus('complete')
        return
      }

      advanceReveal()
    }, msPerChar)

    return () => {
      window.clearInterval(id)
    }
  }, [
    mode,
    activeSnippetIndex,
    msPerChar,
    demoRepeatEnabled,
    demoTimeLimitMinutes,
    demoPassLimit,
    runNonce,
    advanceReveal,
    resetDemoRunState,
    setDemoSessionStartedAt,
    setDemoCompletedPasses,
    incrementDemoCompletedPasses,
    setStatus,
    content.length,
  ])
}
