import type { ReactElement } from 'react'

import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import IconButton from '@mui/material/IconButton'
import Toolbar from '@mui/material/Toolbar'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { Link as RouterLink, Outlet } from 'react-router-dom'

export function AppLayout(): ReactElement {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="sticky" color="transparent" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Toolbar sx={{ gap: 2 }}>
          <Typography variant="h6" component={RouterLink} to="/" sx={{ textDecoration: 'none', color: 'text.primary', flexGrow: 1 }}>
            Typing simulator
          </Typography>
          <Tooltip title="Snippets">
            <IconButton component={RouterLink} to="/" color="inherit" aria-label="Snippets home">
              <MenuBookOutlinedIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Settings">
            <IconButton component={RouterLink} to="/settings" color="inherit" aria-label="Settings">
              <SettingsOutlinedIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ py: 4, flex: 1 }}>
        <Outlet />
      </Container>
    </Box>
  )
}
