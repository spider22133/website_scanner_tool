import { useState } from 'react'
import { useSelector } from 'react-redux'
import { NavLink, Link } from 'react-router-dom'
import { logout } from '../../slices/auth.slice'
import { RootState, useAppDispatch } from '../../store'
import { Box } from '@mui/material'

export default function Header() {
  const { isLoggedIn, user } = useSelector((state: RootState) => state.auth)
  const [toogle, setToogle] = useState(false)

  const dispatch = useAppDispatch()

  return (
    <nav className="navbar navbar-expand-lg navbar-light" style={{ backgroundColor: 'white' }}>
      <Box className="container-fluid">
        <Box sx={{ px: 2, py: 1, width: '100%', display: 'flex' }}>
          <Link className="navbar-brand" to={'/dashboard'}>
            <img src="/logo.jpg" alt="logo" width="50" height="50" />
          </Link>
          <button
            className={`navbar-toggler ${toogle ? '' : 'collapsed'}`}
            type="button"
            onClick={() => (toogle == false ? setToogle(true) : setToogle(false))}
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className={`collapse navbar-collapse ${toogle ? 'show' : ''}`} id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink className={({ isActive }) => ['nav-link', isActive ? 'active' : ''].join(' ')} aria-current="page" to={'/dashboard'}>
                  Versionskontroll-Dashboard
                </NavLink>
              </li>
            </ul>

            {isLoggedIn ? (
              <ul className="navbar-nav">
                <li className="nav-item">
                  <div className="nav-link">
                    Hallo, {user.firstName} {user.lastName}
                  </div>
                </li>
                <li className="nav-item">
                  <button className="btn btn-outline-danger btn-sm mt-1" onClick={() => dispatch(logout())}>
                    Abmelden
                  </button>
                </li>
              </ul>
            ) : (
              <div>
                <Link className="btn btn-outline-success" to="/login">
                  Anmelden
                </Link>
              </div>
            )}
          </div>
        </Box>
      </Box>
    </nav>
  )
}
