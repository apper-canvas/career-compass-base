import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
// Component to protect routes that require employer role
const EmployerRoute = ({ children }) => {
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect to home if not an employer
  if (user.role !== 'employer') {
    return <Navigate to="/" state={{ message: "You need an employer account to access this page" }} replace />;
  }
  
  // User is authenticated and is an employer, render the protected content

  return children;
};

export default EmployerRoute;