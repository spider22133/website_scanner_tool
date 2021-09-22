import { Link } from 'react-router-dom';

export default function Header() {
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
          <div>
            <Link className="btn btn-outline-success" to="/login">
              Login
            </Link>
            <Link className="btn btn-outline" to="/signup">
              Signup
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
