import { useEffect } from 'react'

import {
  isCountableMistakeKey,
  keyEventMatchesExpected,
  shouldIgnoreKeyEvent,
} from '../utils/keyboard'
import { useTypingStore } from '../store/useTypingStore'

/**
 * Practice mode: captures keystrokes, compares to the snippet, tracks errors and timer start.
 */
export function usePracticeTyping(): void {
  const mode = useTypingStore((s) => s.mode)

  useEffect(() => {
    if (mode !== 'practice') {
      return
    }

    const onKeyDown = (e: KeyboardEvent): void => {
      const state = useTypingStore.getState()
      if (state.status === 'complete') {
        return
      }

      const content = state.snippets[state.activeSnippetIndex]?.content ?? ''
      const pos = state.revealedLength

      if (shouldIgnoreKeyEvent(e)) {
        return
      }

      if (e.key === 'Backspace') {
        e.preventDefault()
        state.backspaceInPractice()
        return
      }

      if (pos >= content.length) {
        return
      }

      const expected = content[pos] ?? ''

      if (keyEventMatchesExpected(e, expected)) {
        e.preventDefault()
        if (state.practiceStartedAt === null) {
          state.setPracticeStartedAt(Date.now())
        }
        state.advanceReveal()
        return
      }

      if (isCountableMistakeKey(e)) {
        e.preventDefault()
        state.incrementError()
      }
    }

    window.addEventListener('keydown', onKeyDown, true)
    return () => {
      window.removeEventListener('keydown', onKeyDown, true)
    }
  }, [mode])
}
