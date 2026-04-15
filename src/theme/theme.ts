import { createTheme } from '@mui/material/styles'

export const appTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#7dd3fc',
    },
    secondary: {
      main: '#c4b5fd',
    },
    background: {
      default: '#0f1419',
      paper: '#161b22',
    },
  },
  typography: {
    fontFamily: '"JetBrains Mono", "Fira Code", ui-monospace, monospace',
    h4: {
      fontWeight: 600,
      letterSpacing: '-0.02em',
    },
    body1: {
      lineHeight: 1.65,
    },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage:
            'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(125, 211, 252, 0.12), transparent)',
        },
      },
    },
  },
})
