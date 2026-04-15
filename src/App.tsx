import type { ReactElement } from 'react'

import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import { AppLayout } from './components/AppLayout'

/** Correct routes on GitHub Pages (`/Typing-simulator/`) and locally (`/`). */
function routerBasename(): string | undefined {
  const base = import.meta.env.BASE_URL
  if (base === '/') return undefined
  const trimmed = base.replace(/\/$/, '')
  return trimmed === '' ? undefined : trimmed
}
import { appTheme } from './theme/theme'
import { HomePage } from './pages/HomePage'
import { SettingsPage } from './pages/SettingsPage'

export default function App(): ReactElement {
  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <BrowserRouter basename={routerBasename()}>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<HomePage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}
