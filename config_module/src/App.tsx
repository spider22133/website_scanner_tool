import './App.css'
import { Switch } from 'react-router-dom'
import { PublicRoute, PrivateRoute } from './helpers/routing.helper'

import Header from './components/layout/header.component'
import LogIn from './components/auth/login.component'
import SignUp from './components/auth/signup.component'
import { createTheme, ThemeProvider } from '@mui/material/styles'

import 'bootstrap/dist/css/bootstrap.css'
import DashboardComponent from './components/dashboard.component'

import { useSnackbar } from 'notistack'
import { RootState } from './store'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'

const theme = createTheme()

function App() {
  const { enqueueSnackbar } = useSnackbar()
  const dispatch = useDispatch()
  const messages = useSelector((state: RootState) => state.messages)

  useEffect(() => {
    if (messages.length > 0) {
      // Only show the latest message (last in array) to avoid showing all
      const latestMessage = messages[messages.length - 1]
      enqueueSnackbar(latestMessage.message, {
        variant: latestMessage.variant,
      })
    }
  }, [messages, enqueueSnackbar, dispatch])

  return (
    <ThemeProvider theme={theme}>
      <Header />
      <Switch>
        <PublicRoute exact path={['/', '/login']} component={LogIn} />
        <PublicRoute exact path={['/signup']} component={SignUp} />
        <PrivateRoute exact path={'/dashboard'} component={DashboardComponent} />
      </Switch>
    </ThemeProvider>
  )
}

export default App
