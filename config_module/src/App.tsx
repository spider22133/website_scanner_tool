import './App.css'
import { Routes, Route } from 'react-router-dom'
import Header from './components/layout/header.component'
import LogIn from './components/auth/login.component'
import DashboardComponent from './components/dashboard.component'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { useDispatch, useSelector } from 'react-redux'
import { useSnackbar } from 'notistack'
import { RootState } from './store'
import { useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import { RedirectIfLogged, RequireAuth } from './helpers/routing.helper'

const theme = createTheme()

function App() {
  const { enqueueSnackbar } = useSnackbar()
  const dispatch = useDispatch()
  const messages = useSelector((state: RootState) => state.messages)

  useEffect(() => {
    if (messages.length > 0) {
      const latestMessage = messages[messages.length - 1]
      enqueueSnackbar(latestMessage.message, {
        variant: latestMessage.variant,
      })
    }
  }, [messages, enqueueSnackbar, dispatch])

  return (
    <ThemeProvider theme={theme}>
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            <RedirectIfLogged>
              <LogIn />
            </RedirectIfLogged>
          }
        />
        <Route
          path="/login"
          element={
            <RedirectIfLogged>
              <LogIn />
            </RedirectIfLogged>
          }
        />
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <DashboardComponent />
            </RequireAuth>
          }
        />
      </Routes>
    </ThemeProvider>
  )
}

export default App
