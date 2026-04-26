import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';
import LoadingSpinner from '../UI/LoadingSpinner.jsx';

function ProtectedRoute({ children, roles = [] }) {
  const location = useLocation();
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner className="py-20" />;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (roles.length && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
