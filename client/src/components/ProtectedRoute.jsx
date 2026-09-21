import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="loading">Loading...</div>;

  if (!user) {
    // First-time visitor: no tokens stored at all → send to Register
    // Returning user whose session expired → send to Login
    const hasBeenHereBefore = localStorage.getItem('accessToken') || localStorage.getItem('refreshToken');
    return <Navigate to={hasBeenHereBefore ? '/login' : '/register'} replace />;
  }

  if (adminOnly && user.role !== 'admin') return <Navigate to="/" replace />;

  return children;
}
