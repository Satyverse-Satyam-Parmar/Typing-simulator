import { useEffect, type ReactElement } from 'react'

import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import Slider from '@mui/material/Slider'
import Stack from '@mui/material/Stack'
import Switch from '@mui/material/Switch'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { Controller, useForm, useWatch } from 'react-hook-form'

import type { SettingsFormValues } from '../types'
import { useTypingStore } from '../store/useTypingStore'

export function SettingsPage(): ReactElement {
  const displayName = useTypingStore((s) => s.displayName)
  const msPerChar = useTypingStore((s) => s.msPerChar)
  const demoRepeatEnabled = useTypingStore((s) => s.demoRepeatEnabled)
  const demoTimeLimitMinutes = useTypingStore((s) => s.demoTimeLimitMinutes)
  const demoPassLimit = useTypingStore((s) => s.demoPassLimit)
  const setDisplayName = useTypingStore((s) => s.setDisplayName)
  const setMsPerChar = useTypingStore((s) => s.setMsPerChar)
  const setDemoRepeatEnabled = useTypingStore((s) => s.setDemoRepeatEnabled)
  const setDemoTimeLimitMinutes = useTypingStore((s) => s.setDemoTimeLimitMinutes)
  const setDemoPassLimit = useTypingStore((s) => s.setDemoPassLimit)

  const {
    control,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<SettingsFormValues>({
    defaultValues: {
      displayName,
      msPerChar,
      demoRepeatEnabled,
      demoTimeLimitMinutes,
      demoPassLimit,
    },
  })

  const repeatOn = useWatch({ control, name: 'demoRepeatEnabled', defaultValue: demoRepeatEnabled })

  useEffect(() => {
    reset({
      displayName,
      msPerChar,
      demoRepeatEnabled,
      demoTimeLimitMinutes,
      demoPassLimit,
    })
  }, [displayName, msPerChar, demoRepeatEnabled, demoTimeLimitMinutes, demoPassLimit, reset])

  const onSubmit = (values: SettingsFormValues): void => {
    if (values.demoRepeatEnabled && values.demoTimeLimitMinutes <= 0 && values.demoPassLimit <= 0) {
      setError('demoTimeLimitMinutes', {
        type: 'manual',
        message: 'Set a time limit and/or pass limit when repeat is on.',
      })
      setError('demoPassLimit', { type: 'manual', message: ' ' })
      return
    }
    clearErrors()
    setDisplayName(values.displayName)
    setMsPerChar(values.msPerChar)
    setDemoRepeatEnabled(values.demoRepeatEnabled)
    setDemoTimeLimitMinutes(values.demoTimeLimitMinutes)
    setDemoPassLimit(values.demoPassLimit)
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Settings
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Preferences stay in memory for this session only. Demo: set speed (ms/char), whether to repeat, and limits —
          looping stops when the time budget or pass count is reached, whichever comes first.
        </Typography>
      </Box>

      <Stack spacing={2} sx={{ maxWidth: 520 }}>
        <Controller
          name="displayName"
          control={control}
          render={({ field }) => (
            <TextField {...field} label="Display name" fullWidth autoComplete="off" />
          )}
        />

        <Controller
          name="msPerChar"
          control={control}
          render={({ field }) => (
            <Box>
              <Typography id="ms-per-char-label" gutterBottom>
                Demo speed — milliseconds per character: {field.value}
              </Typography>
              <Slider
                {...field}
                aria-labelledby="ms-per-char-label"
                value={field.value}
                onChange={(_e, value) => {
                  const next = Array.isArray(value) ? value[0] : value
                  field.onChange(next ?? field.value)
                }}
                min={8}
                max={200}
                step={1}
              />
            </Box>
          )}
        />

        <Typography variant="subtitle2" sx={{ pt: 1 }}>
          Demo repeat & limits
        </Typography>

        <Controller
          name="demoRepeatEnabled"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={
                <Switch
                  checked={field.value}
                  onChange={(_e, v) => field.onChange(v)}
                  slotProps={{ input: { 'aria-label': 'Repeat snippet in demo' } }}
                />
              }
              label="Repeat snippet (loop)"
            />
          )}
        />

        {repeatOn && (
          <Alert severity="info" variant="outlined">
            With repeat on, set at least one limit: time (minutes) and/or number of full passes. The demo stops when
            either limit is reached.
          </Alert>
        )}

        <Controller
          name="demoTimeLimitMinutes"
          control={control}
          render={({ field }) => (
            <Box>
              <Typography id="demo-time-label" gutterBottom>
                Time limit (minutes): {field.value === 0 ? 'none' : field.value}
              </Typography>
              <Slider
                {...field}
                aria-labelledby="demo-time-label"
                value={field.value}
                onChange={(_e, value) => {
                  const next = Array.isArray(value) ? value[0] : value
                  field.onChange(next ?? field.value)
                }}
                min={0}
                max={180}
                step={1}
              />
            </Box>
          )}
        />

        <Controller
          name="demoPassLimit"
          control={control}
          render={({ field }) => (
            <Box>
              <Typography id="demo-pass-label" gutterBottom>
                Pass limit (full runs): {field.value === 0 ? 'none' : field.value}
              </Typography>
              <Slider
                {...field}
                aria-labelledby="demo-pass-label"
                value={field.value}
                onChange={(_e, value) => {
                  const next = Array.isArray(value) ? value[0] : value
                  field.onChange(next ?? field.value)
                }}
                min={0}
                max={200}
                step={1}
              />
            </Box>
          )}
        />

        {(errors.demoTimeLimitMinutes ?? errors.demoPassLimit) && (
          <Alert severity="error">
            When repeat is on, set a time limit and/or pass limit (at least one must be greater than zero).
          </Alert>
        )}

        <Box>
          <Button type="button" variant="contained" startIcon={<SaveOutlinedIcon />} onClick={() => void handleSubmit(onSubmit)()}>
            Save
          </Button>
        </Box>
      </Stack>
    </Stack>
  )
}
