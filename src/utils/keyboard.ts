/** Whether the key event should be ignored (modifiers, navigation, etc.). */
export function shouldIgnoreKeyEvent(e: KeyboardEvent): boolean {
  if (e.ctrlKey || e.metaKey || e.altKey) return true
  if (e.key === 'Shift' || e.key === 'Escape' || e.key === 'Dead') return true
  return false
}

/** True if `e` corresponds to typing the expected single character or newline/tab. */
export function keyEventMatchesExpected(e: KeyboardEvent, expected: string): boolean {
  if (expected === '\n' && e.key === 'Enter') return true
  if (expected === '\t' && e.key === 'Tab') return true
  if (expected.length === 1 && e.key.length === 1 && e.key === expected) return true
  return false
}

/** Wrong keys we count toward accuracy (real keystrokes toward the line, not modifiers). */
export function isCountableMistakeKey(e: KeyboardEvent): boolean {
  if (e.key === 'Backspace') return false
  if (e.key === 'Enter' || e.key === 'Tab') return true
  if (e.key.length === 1) return true
  return false
}
