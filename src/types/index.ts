export interface CodeSnippet {
  id: string
  title: string
  language: string
  content: string
}

export type TypingRunStatus = 'idle' | 'typing' | 'complete' | 'paused'

/** Demo = auto-type animation; Practice = you type with live stats. */
export type AppMode = 'demo' | 'practice'

export interface SettingsFormValues {
  displayName: string
  /** Typing speed in demo mode (ms between characters). */
  msPerChar: number
  /** When true, snippet restarts after each full pass if limits allow. */
  demoRepeatEnabled: boolean
  /** Stop after this many wall-clock minutes (0 = no time cap). */
  demoTimeLimitMinutes: number
  /** Stop after this many full passes through the snippet (0 = no pass cap). */
  demoPassLimit: number
}
