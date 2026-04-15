import type { MouseEvent, ReactElement } from 'react'

import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import LinearProgress from '@mui/material/LinearProgress'
import Stack from '@mui/material/Stack'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Typography from '@mui/material/Typography'

import { DemoVirtualKeyboard } from '../components/DemoVirtualKeyboard'
import { KeyStrokeLog } from '../components/KeyStrokeLog'
import { TypingSnippetView } from '../components/TypingSnippetView'
import { useDemoRemainingMs } from '../hooks/useDemoRemainingMs'
import { useLiveElapsedMs } from '../hooks/useLiveElapsedMs'
import { usePracticeTyping } from '../hooks/usePracticeTyping'
import { useTypingEngine } from '../hooks/useTypingEngine'
import type { AppMode } from '../types'
import { useTypingStore } from '../store/useTypingStore'

function formatDuration(ms: number): string {
  const s = Math.floor(ms / 1000)
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m}:${String(sec).padStart(2, '0')}`
}

function computeWpm(revealedLength: number, elapsedMs: number): number {
  if (elapsedMs <= 0) return 0
  const words = revealedLength / 5
  const minutes = elapsedMs / 60000
  return Math.round(words / minutes)
}

function computeAccuracy(revealedLength: number, errorStrokes: number): number {
  const total = revealedLength + errorStrokes
  if (total <= 0) return 100
  return Math.round((revealedLength / total) * 1000) / 10
}

export function HomePage(): ReactElement {
  useTypingEngine()
  usePracticeTyping()

  const snippets = useTypingStore((s) => s.snippets)
  const activeSnippetIndex = useTypingStore((s) => s.activeSnippetIndex)
  const revealedLength = useTypingStore((s) => s.revealedLength)
  const status = useTypingStore((s) => s.status)
  const mode = useTypingStore((s) => s.mode)
  const displayName = useTypingStore((s) => s.displayName)
  const errorStrokes = useTypingStore((s) => s.errorStrokes)
  const practiceStartedAt = useTypingStore((s) => s.practiceStartedAt)
  const setActiveSnippetIndex = useTypingStore((s) => s.setActiveSnippetIndex)
  const setMode = useTypingStore((s) => s.setMode)
  const resetCurrentRun = useTypingStore((s) => s.resetCurrentRun)
  const demoRepeatEnabled = useTypingStore((s) => s.demoRepeatEnabled)
  const demoTimeLimitMinutes = useTypingStore((s) => s.demoTimeLimitMinutes)
  const demoPassLimit = useTypingStore((s) => s.demoPassLimit)
  const demoCompletedPasses = useTypingStore((s) => s.demoCompletedPasses)
  const demoSessionStartedAt = useTypingStore((s) => s.demoSessionStartedAt)

  const snippet = snippets[activeSnippetIndex]
  const content = snippet?.content ?? ''
  const progress = content.length > 0 ? (revealedLength / content.length) * 100 : 0

  const elapsedMs = useLiveElapsedMs(
    practiceStartedAt,
    mode === 'practice' && practiceStartedAt !== null && status !== 'complete',
  )
  const wpm = mode === 'practice' ? computeWpm(revealedLength, elapsedMs) : 0
  const accuracy =
    mode === 'practice' && practiceStartedAt !== null ? computeAccuracy(revealedLength, errorStrokes) : null

  const highlightNext = status !== 'complete' && revealedLength < content.length

  const lastDemoKey = mode === 'demo' && revealedLength > 0 ? content[revealedLength - 1] ?? null : null

  const demoRemainingMs = useDemoRemainingMs(
    demoSessionStartedAt,
    demoTimeLimitMinutes,
    mode === 'demo' &&
      demoRepeatEnabled &&
      demoTimeLimitMinutes > 0 &&
      status !== 'complete',
  )

  const demoShowProgress =
    mode === 'demo' &&
    demoRepeatEnabled &&
    status !== 'complete' &&
    (demoTimeLimitMinutes > 0 || demoPassLimit > 0)

  const onModeChange = (_: MouseEvent<HTMLElement>, next: AppMode | null): void => {
    if (next !== null) {
      setMode(next)
    }
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="overline" color="text.secondary">
          Hello, {displayName}
        </Typography>
        <Typography variant="h4" component="h1" gutterBottom>
          {snippet?.title ?? 'Snippet'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {mode === 'demo' &&
            (status === 'complete'
              ? 'Demo finished — switch snippet, try Practice, or Restart.'
              : demoRepeatEnabled
                ? 'Demo repeats the snippet at the speed you set until the time and/or pass limit in Settings is reached (whichever comes first).'
                : 'Demo runs the snippet once at your set speed (ms/char). Enable “Repeat snippet” in Settings to loop with time/pass limits.')}
          {mode === 'practice' &&
            (status === 'complete'
              ? 'Nice — pick another snippet or hit Restart.'
              : 'Practice mode: type what you see; timer starts on your first keystroke.')}
        </Typography>
      </Box>

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        useFlexGap
        sx={{ flexWrap: 'wrap', alignItems: { sm: 'center' } }}
      >
        <ToggleButtonGroup value={mode} exclusive onChange={onModeChange} color="primary" aria-label="Typing mode">
          <ToggleButton value="demo" aria-label="Demo mode">
            Demo
          </ToggleButton>
          <ToggleButton value="practice" aria-label="Practice mode">
            Practice
          </ToggleButton>
        </ToggleButtonGroup>
        <Button variant="outlined" startIcon={<RefreshOutlinedIcon />} onClick={() => resetCurrentRun()} type="button">
          Restart run
        </Button>
      </Stack>

      {mode === 'practice' && status !== 'complete' && (
        <Alert severity="info" variant="outlined">
          Focus this page and type the highlighted character. Tab and Enter match indentation and line breaks. Backspace
          removes one correct character.
        </Alert>
      )}

      {mode === 'practice' && (
        <Stack direction="row" useFlexGap spacing={1} sx={{ flexWrap: 'wrap' }}>
          <Chip label={`WPM ${practiceStartedAt === null ? '—' : String(wpm)}`} variant="outlined" />
          <Chip label={`Accuracy ${accuracy === null ? '—' : `${accuracy}%`}`} variant="outlined" />
          <Chip label={`Errors ${errorStrokes}`} variant="outlined" />
          <Chip
            label={`Time ${practiceStartedAt === null ? '0:00' : formatDuration(elapsedMs)}`}
            variant="outlined"
          />
        </Stack>
      )}

      {mode === 'demo' && demoRepeatEnabled && status === 'complete' && (
        <Stack direction="row" useFlexGap spacing={1} sx={{ flexWrap: 'wrap' }}>
          <Chip label="Demo repeat session finished" variant="outlined" />
        </Stack>
      )}

      {demoShowProgress && (
        <Stack direction="row" useFlexGap spacing={1} sx={{ flexWrap: 'wrap' }}>
          {demoTimeLimitMinutes > 0 && (
            <Chip
              color="secondary"
              label={`Time left ${formatDuration(demoRemainingMs)} / ${demoTimeLimitMinutes} min`}
              variant="outlined"
            />
          )}
          {demoPassLimit > 0 && (
            <Chip
              color="secondary"
              label={`Passes ${demoCompletedPasses} / ${demoPassLimit}`}
              variant="outlined"
            />
          )}
        </Stack>
      )}

      <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 1 }} />

      <Stack direction="row" useFlexGap spacing={1} sx={{ flexWrap: 'wrap' }}>
        {snippets.map((s, index) => (
          <Chip
            key={s.id}
            label={s.title}
            color={index === activeSnippetIndex ? 'primary' : 'default'}
            variant={index === activeSnippetIndex ? 'filled' : 'outlined'}
            onClick={() => setActiveSnippetIndex(index)}
          />
        ))}
      </Stack>

      <TypingSnippetView
        language={snippet?.language ?? 'text'}
        content={content}
        revealedLength={revealedLength}
        highlightNext={highlightNext}
      />

      {mode === 'demo' && (
        <Stack spacing={2}>
          <KeyStrokeLog content={content} revealedLength={revealedLength} />
          <DemoVirtualKeyboard lastPressedChar={lastDemoKey} />
        </Stack>
      )}
    </Stack>
  )
}
