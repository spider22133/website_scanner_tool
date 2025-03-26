import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { Provider } from 'react-redux'
import store from './store'
import { StyledEngineProvider } from '@mui/system'
import { CssBaseline } from '@mui/material'
import { SnackbarProvider } from 'notistack'

ReactDOM.render(
  <React.StrictMode>
    <StyledEngineProvider injectFirst>
      <Provider store={store}>
        <SnackbarProvider maxSnack={3}>
          <BrowserRouter>
            <CssBaseline />
            <App />
          </BrowserRouter>
        </SnackbarProvider>
      </Provider>
    </StyledEngineProvider>
  </React.StrictMode>,
  document.getElementById('root'),
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
