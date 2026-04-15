import type { ReactElement } from 'react'

import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'

/** Layout roughly like a keyboard; labels must match `matchesKey`. */
const KEYBOARD_ROWS: readonly (readonly string[])[] = [
  ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
  ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'Enter'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'],
  ['Space'],
  ['<', '>', '(', ')', '{', '}', ':', '*', '&', '|', '"', '!', '%', '_', '='],
]

function matchesKey(label: string, ch: string | null): boolean {
  if (ch === null) return false
  if (label === 'Enter' && ch === '\n') return true
  if (label === 'Tab' && ch === '\t') return true
  if (label === 'Space' && ch === ' ') return true
  return label.length === 1 && label === ch
}

function keyWidth(label: string): number | string {
  if (label === 'Enter') return 72
  if (label === 'Tab') return 52
  if (label === 'Space') return 180
  return 32
}

interface DemoVirtualKeyboardProps {
  /** Last character that was just “pressed” in the simulation (not the next one). */
  lastPressedChar: string | null
}

/**
 * On-screen keys that light up in sync with demo auto-typing (visual only — no real input).
 */
export function DemoVirtualKeyboard({ lastPressedChar }: DemoVirtualKeyboardProps): ReactElement {
  return (
    <Paper variant="outlined" sx={{ p: 1.5, bgcolor: 'background.default' }}>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
        Virtual keyboard (demo)
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }} role="presentation">
        {KEYBOARD_ROWS.map((row, ri) => (
          <Box key={ri} sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: 'center' }}>
            {row.map((label, ki) => {
              const active = matchesKey(label, lastPressedChar)
              return (
                <Box
                  key={`${ri}-${ki}-${label}`}
                  component="span"
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: keyWidth(label),
                    height: 30,
                    px: 0.25,
                    borderRadius: 0.75,
                    fontFamily: 'monospace',
                    fontSize: label.length > 2 ? '0.65rem' : '0.75rem',
                    border: 1,
                    borderColor: active ? 'primary.main' : 'divider',
                    bgcolor: active ? 'primary.dark' : 'action.hover',
                    color: active ? 'primary.contrastText' : 'text.secondary',
                    boxShadow: active ? 2 : 0,
                    transition: 'background-color 80ms ease, box-shadow 80ms ease',
                  }}
                >
                  {label === ' ' ? 'Space' : label}
                </Box>
              )
            })}
          </Box>
        ))}
      </Box>
    </Paper>
  )
}
