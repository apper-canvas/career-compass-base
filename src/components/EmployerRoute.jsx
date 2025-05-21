import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSelector } from 'react-redux';
// Component to protect routes that require employer role
const EmployerRoute = ({ children }) => {
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const location = useLocation();

  if (!isAuthenticated) {
  if (loading) {
    return <div className="flex justify-center items-center h-96">Loading...</div>;
  }

  // Check if the authenticated user is an employer
  if (user.role !== 'employer') {
    // User is not an employer, redirect to home
    return <Navigate to="/login" state={{ from: location, employerRequired: true }} replace />;
  }

  // Redirect to home if not an employer
  if (currentUser.role !== 'employer') {
    return <Navigate to="/" state={{ message: "You need an employer account to access this page" }} replace />;
  }

  return children;
};

export default EmployerRoute;