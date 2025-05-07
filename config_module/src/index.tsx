import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App'
import { Provider } from 'react-redux'
import store from './store/store'
import { StyledEngineProvider } from '@mui/system'
import { CssBaseline } from '@mui/material'
import { SnackbarProvider } from 'notistack'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { deDE } from '@mui/material/locale'
import { deDE as dataGridDE } from '@mui/x-data-grid/locales'

const theme = createTheme(
  {
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1921,
      },
    },
  },
  deDE,
  dataGridDE,
)

// Get the root DOM element
const container = document.getElementById('root')

// Create a root for React rendering
const root = createRoot(container!) // Non-null assertion since we know 'root' exists

// Render the app
root.render(
  <React.StrictMode>
    <StyledEngineProvider injectFirst>
      <Provider store={store}>
        <SnackbarProvider maxSnack={3}>
          <BrowserRouter>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <App />
            </ThemeProvider>
          </BrowserRouter>
        </SnackbarProvider>
      </Provider>
    </StyledEngineProvider>
  </React.StrictMode>,
)
