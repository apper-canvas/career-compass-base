import { Navigate, useLocation } from 'react-router-dom';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
// Component to protect routes that require authentication
const ProtectedRoute = ({ children }) => {
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const location = useLocation();
  const navigate = useNavigate();

  if (!isAuthenticated) {
  if (loading) {
    return <div className="flex justify-center items-center h-96">Loading...</div>;
  }

  // Redirect to login if not authenticated
};
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;