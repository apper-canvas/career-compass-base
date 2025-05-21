import { createContext, useState, useContext, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { sendWelcomeEmail } from '../services/EmailNotificationService';
import { createUser, updateUser } from '../services/userService';

// Create the authentication context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const { user: currentUser, isAuthenticated } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  
  // Register a new user - we keep this as a compatibility layer
  // but most registration will happen via Apper SDK 
  const register = async (userData) => {
    try {
      setLoading(true);
      
      // Create user in database
      const newUser = await createUser(userData);
      
      // Send welcome email
      await sendWelcomeEmail(newUser);
      
      if (userData.role === 'employer') {
        toast.success('Employer account created successfully!');
      } else {
        toast.success('Account created successfully!');
      }
      
      return newUser;
    } catch (error) {
      toast.error(error.message || 'Failed to create account');
      throw error;
    } finally {
      setLoading(false);
     }
  };

  // Convert user to employer (for testing purposes)
  const convertToEmployer = async (companyName, companySize) => {
    try {
      if (!currentUser) {
        throw new Error("You must be logged in to convert to employer");
      }
      setLoading(true);
      
      const userData = {
        ...currentUser,
        role: 'employer',
        companyName,
        companySize
      };
      
      // Update user in database
      const updatedUser = await updateUser(currentUser.Id, userData);
      
      // The Apper SDK will handle updating Redux store
      
      toast.success('Account converted to employer successfully!');
      return updatedUser;
    } catch (error) {
      toast.error(error.message || 'Failed to convert account to employer');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    currentUser,
    isAuthenticated,
    loading,
    register,
    convertToEmployer,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};