import { create } from 'zustand'

import { snippets } from '../data/snippets'
import type { AppMode, CodeSnippet, TypingRunStatus } from '../types'

export interface TypingState {
  snippets: readonly CodeSnippet[]
  activeSnippetIndex: number
  revealedLength: number
  status: TypingRunStatus
  mode: AppMode
  /** Delay between each revealed character in demo mode */
  msPerChar: number
  displayName: string
  /** Wrong keystrokes in the current practice run */
  errorStrokes: number
  /** Wall-clock start when the user types the first key in practice */
  practiceStartedAt: number | null
  /** Bumped on Restart so demo mode re-runs its interval without changing snippet. */
  runNonce: number

  /** Demo: repeat snippet when limits allow */
  demoRepeatEnabled: boolean
  /** 0 = no time limit */
  demoTimeLimitMinutes: number
  /** 0 = no pass limit */
  demoPassLimit: number
  /** Completed full passes this demo session (incremented at end of each pass when repeat is on). */
  demoCompletedPasses: number
  /** Wall-clock start of the current demo session */
  demoSessionStartedAt: number | null

  setActiveSnippetIndex: (index: number) => void
  setMode: (mode: AppMode) => void
  setRevealedLength: (length: number) => void
  advanceReveal: () => void
  resetCurrentRun: () => void
  resetDemoRunState: () => void
  setStatus: (status: TypingRunStatus) => void
  setMsPerChar: (ms: number) => void
  setDisplayName: (name: string) => void
  incrementError: () => void
  backspaceInPractice: () => void
  setPracticeStartedAt: (t: number | null) => void

  setDemoRepeatEnabled: (v: boolean) => void
  setDemoTimeLimitMinutes: (n: number) => void
  setDemoPassLimit: (n: number) => void
  setDemoSessionStartedAt: (t: number | null) => void
  setDemoCompletedPasses: (n: number) => void
  incrementDemoCompletedPasses: () => void
}

function clampIndex(index: number, max: number): number {
  if (index < 0) return 0
  if (index > max) return max
  return index
}

function initialRunState(): Pick<
  TypingState,
  'revealedLength' | 'status' | 'errorStrokes' | 'practiceStartedAt'
> {
  return {
    revealedLength: 0,
    status: 'idle',
    errorStrokes: 0,
    practiceStartedAt: null,
  }
}

export const useTypingStore = create<TypingState>((set, get) => ({
  snippets,
  activeSnippetIndex: 0,
  ...initialRunState(),
  runNonce: 0,
  demoRepeatEnabled: false,
  demoTimeLimitMinutes: 0,
  demoPassLimit: 0,
  demoCompletedPasses: 0,
  demoSessionStartedAt: null,
  mode: 'demo',
  msPerChar: 42,
  displayName: 'Typist',

  setActiveSnippetIndex: (index: number) => {
    const { snippets: list } = get()
    const next = clampIndex(index, Math.max(0, list.length - 1))
    set({ activeSnippetIndex: next, ...initialRunState(), runNonce: 0 })
  },

  setMode: (mode: AppMode) => set({ mode, ...initialRunState(), runNonce: 0 }),

  setRevealedLength: (length: number) => set({ revealedLength: Math.max(0, length) }),

  advanceReveal: () => {
    const { activeSnippetIndex, snippets: list, revealedLength } = get()
    const content = list[activeSnippetIndex]?.content ?? ''
    if (revealedLength >= content.length) {
      return
    }
    const next = revealedLength + 1
    const done = next >= content.length
    set({
      revealedLength: next,
      status: done ? 'complete' : 'typing',
    })
  },

  resetCurrentRun: () =>
    set((s) => ({
      ...initialRunState(),
      runNonce: s.runNonce + 1,
      demoSessionStartedAt: Date.now(),
      demoCompletedPasses: 0,
    })),

  resetDemoRunState: () => set({ ...initialRunState() }),

  setStatus: (status: TypingRunStatus) => set({ status }),

  setMsPerChar: (ms: number) => {
    const bounded = Math.min(500, Math.max(8, Math.round(ms)))
    set({ msPerChar: bounded })
  },

  setDisplayName: (name: string) => set({ displayName: name.trim() || 'Typist' }),

  incrementError: () => set((s) => ({ errorStrokes: s.errorStrokes + 1 })),

  backspaceInPractice: () => {
    set((s) => {
      if (s.revealedLength <= 0) {
        return s
      }
      return {
        revealedLength: s.revealedLength - 1,
        status: 'typing' as const,
      }
    })
  },

  setPracticeStartedAt: (t: number | null) => set({ practiceStartedAt: t }),

  setDemoRepeatEnabled: (v: boolean) => set({ demoRepeatEnabled: v }),

  setDemoTimeLimitMinutes: (n: number) => {
    const bounded = Math.min(180, Math.max(0, Math.round(n)))
    set({ demoTimeLimitMinutes: bounded })
  },

  setDemoPassLimit: (n: number) => {
    const bounded = Math.min(500, Math.max(0, Math.round(n)))
    set({ demoPassLimit: bounded })
  },

  setDemoSessionStartedAt: (t: number | null) => set({ demoSessionStartedAt: t }),

  setDemoCompletedPasses: (n: number) => set({ demoCompletedPasses: Math.max(0, n) }),

  incrementDemoCompletedPasses: () => set((s) => ({ demoCompletedPasses: s.demoCompletedPasses + 1 })),
}))
