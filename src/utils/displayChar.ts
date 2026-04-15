/** Short label for the “next character” highlight (whitespace is hard to see). */
export function formatCurrentChar(c: string): string {
  if (c === '\n') return '↵'
  if (c === '\t') return '⇥'
  if (c === ' ') return '·'
  return c
}
