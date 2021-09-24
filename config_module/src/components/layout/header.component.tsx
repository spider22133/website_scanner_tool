import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/auth.context';

export default function Header() {
  const { user, unsetCurrentUser } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to={'/websites'}>
          Websites Tool
        </Link>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link active" aria-current="page" to={'/websites'}>
                Websites
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="#">
                Add website
              </Link>
            </li>
          </ul>

          {user ? (
            <ul className="navbar-nav">
              <li className="nav-item">
                <div className="nav-link">Hello, {user ? user.email : ''}</div>
              </li>
              <li className="nav-item">
                <button className="btn btn-outline-danger" onClick={unsetCurrentUser}>
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
