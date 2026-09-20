import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navLinkStyle = ({ isActive }) => ({
  color: isActive ? '#2563eb' : '#374151',
  fontWeight: isActive ? 600 : 400,
  textDecoration: 'none',
});

export default function Layout({ children }) {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div>
      <header style={{ background: 'white', borderBottom: '1px solid #e5e7eb', position: 'sticky', top: 0, zIndex: 100 }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
          <Link to="/" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', textDecoration: 'none' }}>
            CoWork Hub
          </Link>
          <nav style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <NavLink to="/spaces" style={navLinkStyle}>Spaces</NavLink>
            {user && (
              <>
                <NavLink to="/my-bookings" style={navLinkStyle}>My Bookings</NavLink>
                {isAdmin && <NavLink to="/admin" style={navLinkStyle}>Admin</NavLink>}
              </>
            )}
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>{user.name}</span>
                <button type="button" className="btn btn-secondary btn-sm" onClick={handleLogout}>Logout</button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Link to="/login" className="btn btn-secondary btn-sm">Login</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
              </div>
            )}
          </nav>
        </div>
      </header>
      <main style={{ padding: '2rem 0', minHeight: 'calc(100vh - 64px)' }}>
        <div className="container">{children}</div>
      </main>
    </div>
  );
}
