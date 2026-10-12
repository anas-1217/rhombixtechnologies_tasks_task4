import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="navbar">
      <NavLink to="/" className="nav-logo">
        Quill &amp; Ink
      </NavLink>
      <nav className="nav-links">
        <NavLink to="/" end className="nav-link">
          Stories
        </NavLink>
        {isAdmin && (
          <NavLink to="/admin" className="nav-link">
            Admin
          </NavLink>
        )}
        {user ? (
          <>
            <span className="nav-user">{user.name}</span>
            <button type="button" className="nav-btn" onClick={onLogout}>
              Log out
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" className="nav-link">
              Log in
            </NavLink>
            <NavLink to="/register" className="nav-cta">
              Join
            </NavLink>
          </>
        )}
      </nav>
    </header>
  );
}
