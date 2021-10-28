import { useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink, Link } from 'react-router-dom';
import { logout } from '../../slices/auth.slice';
import { RootState, useAppDispatch } from '../../store';

export default function Header() {
  const { isLoggedIn, user } = useSelector((state: RootState) => state.auth);
  const [toogle, setToogle] = useState(false);

  const dispatch = useAppDispatch();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to={'/websites'}>
          <img src="/logo.jpg" alt="logo" width="50" height="50" />
        </Link>
        <button
          className={`navbar-toggler ${toogle ? '' : 'collapsed'}`}
          type="button"
          onClick={() => (toogle == false ? setToogle(true) : setToogle(false))}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse ${toogle ? 'show' : ''}`} id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link" activeClassName="active" aria-current="page" to={'/websites'}>
                Websites
              </NavLink>
            </li>
          </ul>

          {isLoggedIn ? (
            <ul className="navbar-nav">
              <li className="nav-item">
                <div className="nav-link">
                  Hello, {user.firstName} {user.lastName}
                </div>
              </li>
              <li className="nav-item">
                <button className="btn btn-outline-danger btn-sm mt-1" onClick={() => dispatch(logout())}>
                  Logout
                </button>
              </li>
            </ul>
          ) : (
            <div>
              <Link className="btn btn-outline-success" to="/login">
                Login
              </Link>
              <Link className="btn btn-outline" to="/signup">
                Signup
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
