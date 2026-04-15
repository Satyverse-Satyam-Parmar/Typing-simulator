import type { ReactElement } from 'react'

import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'

import { formatCurrentChar } from '../utils/displayChar'

const MAX_KEYS = 28

interface KeyStrokeLogProps {
  /** Full snippet text */
  content: string
  /** How many characters have been “pressed” in demo */
  revealedLength: number
}

/**
 * Small readout of the last simulated keystrokes (demo mode).
 */
export function KeyStrokeLog({ content, revealedLength }: KeyStrokeLogProps): ReactElement {
  const start = Math.max(0, revealedLength - MAX_KEYS)
  const slice = content.slice(start, revealedLength)

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 1.5,
        minHeight: 52,
        bgcolor: 'action.hover',
        borderStyle: 'dashed',
      }}
    >
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.75 }}>
        Simulated keys (latest → right)
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 0.5,
          alignItems: 'center',
          minHeight: 28,
        }}
        aria-live="polite"
        aria-label="Simulated keystroke log"
      >
        {slice.length === 0 ? (
          <Typography variant="body2" color="text.disabled" sx={{ fontFamily: 'monospace' }}>
            …
          </Typography>
        ) : (
          Array.from(slice).map((ch, i) => {
            const isLatest = i === slice.length - 1
            return (
              <Box
                key={`k-${start + i}`}
                component="span"
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: 26,
                  height: 26,
                  px: 0.5,
                  borderRadius: 0.5,
                  fontFamily: 'monospace',
                  fontSize: '0.8rem',
                  border: 1,
                  borderColor: isLatest ? 'primary.main' : 'divider',
                  bgcolor: isLatest ? 'action.selected' : 'background.paper',
                  color: 'text.primary',
                  boxShadow: isLatest ? 1 : 0,
                }}
              >
                {formatCurrentChar(ch)}
              </Box>
            )
          })
        )}
      </Box>
    </Paper>
  )
}
