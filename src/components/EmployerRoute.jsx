import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Component to protect routes that require employer role
const EmployerRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return <div className="flex justify-center items-center h-96">Loading...</div>;
  }

  // Redirect to login if not authenticated
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location, employerRequired: true }} replace />;
  }

  // Redirect to home if not an employer
  if (currentUser.role !== 'employer') {
    return <Navigate to="/" state={{ message: "You need an employer account to access this page" }} replace />;
  }

  return children;
};

export default EmployerRoute;