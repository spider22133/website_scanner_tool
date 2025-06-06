import { Navigate, useLocation } from 'react-router-dom'
import { userIsLogged } from './session.helper'

import type { JSX } from 'react'

export const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const location = useLocation()
  return userIsLogged() ? children : <Navigate to="/login" state={{ from: location }} replace />
}

export const RedirectIfLogged = ({ children }: { children: JSX.Element }) => {
  return userIsLogged() ? <Navigate to="/dashboard" replace /> : children
}
