import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
// Component to protect routes that require authentication
const ProtectedRoute = ({ children }) => {
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // User is authenticated, render the protected content
  return children;

};

export default ProtectedRoute;