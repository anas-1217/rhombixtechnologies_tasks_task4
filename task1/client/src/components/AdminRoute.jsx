import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminRoute({ children }) {
  const { user, ready, isAdmin } = useAuth();

  if (!ready) return <p className="muted">Loading…</p>;
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
}
