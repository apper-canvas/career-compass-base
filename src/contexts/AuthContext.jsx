import { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';

// Create the authentication context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Register a new user
  const register = async (email, password, firstName, lastName) => {
    try {
      // In a real app, this would call an API endpoint
      // For demo purposes, we'll simulate a successful registration
      setLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if email already exists
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
      if (existingUsers.find(user => user.email === email)) {
        throw new Error('Email already exists');
      }
      
      // Create new user
      const newUser = {
        id: Date.now().toString(),
        email,
        firstName,
        lastName,
        role: 'candidate',
        createdAt: new Date().toISOString()
      };
      
      // Save to "database" (localStorage for demo)
      existingUsers.push({ ...newUser, password });
      localStorage.setItem('users', JSON.stringify(existingUsers));
      
      // Set current user (but don't include password)
      setCurrentUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      toast.success('Account created successfully!');
      return newUser;
    } catch (error) {
      toast.error(error.message || 'Failed to create account');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Login a user
  const login = async (email, password) => {
    try {
      setLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user in "database"
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.email === email && u.password === password);
      
      if (!user) {
        throw new Error('Invalid email or password');
      }
      
      // Create a copy without the password
      const { password: _, ...userWithoutPassword } = user;
      setCurrentUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      
      toast.success('Logged in successfully!');
      return userWithoutPassword;
    } catch (error) {
      toast.error(error.message || 'Failed to log in');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout the current user
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('user');
    toast.info('Logged out successfully');
  };

  const value = {
    currentUser,
    loading,
    register,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};