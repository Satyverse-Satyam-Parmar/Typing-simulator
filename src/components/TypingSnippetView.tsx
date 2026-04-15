import type { ReactElement } from 'react'

import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'

import { formatCurrentChar } from '../utils/displayChar'

interface TypingSnippetViewProps {
  language: string
  content: string
  revealedLength: number
  /** When true, the first character of the remaining text is emphasized. */
  highlightNext: boolean
}

export function TypingSnippetView({
  language,
  content,
  revealedLength,
  highlightNext,
}: TypingSnippetViewProps): ReactElement {
  const done = content.slice(0, revealedLength)
  const tail = content.slice(revealedLength)
  const nextChar = tail[0] ?? ''
  const restAfterNext = tail.slice(1)
  const showNextHighlight = highlightNext && nextChar !== ''

  return (
    <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.paper' }}>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
        {language}
      </Typography>
      <Box
        component="pre"
        sx={{
          m: 0,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          fontFamily: 'inherit',
          fontSize: '0.95rem',
          lineHeight: 1.6,
        }}
      >
        <Box component="span" sx={{ color: 'primary.light' }}>
          {done}
        </Box>
        {showNextHighlight ? (
          <Box
            component="span"
            sx={{
              display: 'inline-block',
              px: 0.25,
              borderRadius: 0.5,
              bgcolor: 'action.selected',
              color: 'warning.light',
              boxShadow: (theme) => `inset 0 -2px 0 ${theme.palette.primary.main}`,
            }}
            aria-current="true"
          >
            {formatCurrentChar(nextChar)}
          </Box>
        ) : (
          <Box component="span" sx={{ color: 'text.disabled' }}>
            {tail}
          </Box>
        )}
        {showNextHighlight ? (
          <Box component="span" sx={{ color: 'text.disabled' }}>
            {restAfterNext}
          </Box>
        ) : null}
      </Box>
    </Paper>
  )
}
