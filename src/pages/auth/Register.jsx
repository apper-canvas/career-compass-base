import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getIcon } from '../../utils/iconUtils';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();
  
  // Icons
  const EyeIcon = getIcon('eye');
  const EyeOffIcon = getIcon('eyeOff');
  const MailIcon = getIcon('mail');
  const LockIcon = getIcon('lock');
  const UserIcon = getIcon('user');
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Validate form inputs
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email address is invalid';
    
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      await register(
        formData.email,
        formData.password,
        formData.firstName,
        formData.lastName
      );
      
      navigate('/');
    } catch (error) {
      // Error is handled in the auth context
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="max-w-md mx-auto my-12 px-4">
      <div className="card">
        <h2 className="text-2xl font-bold text-center mb-6">Create an Account</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium mb-1">
                First Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-surface-500">
                  <UserIcon className="h-5 w-5" />
                </span>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  className={`input-field pl-10 ${errors.firstName ? 'ring-2 ring-red-500' : ''}`}
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
              {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
            </div>
            
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium mb-1">
                Last Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-surface-500">
                  <UserIcon className="h-5 w-5" />
                </span>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  className={`input-field pl-10 ${errors.lastName ? 'ring-2 ring-red-500' : ''}`}
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
              {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
            </div>
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-surface-500">
                <MailIcon className="h-5 w-5" />
              </span>
              <input
                id="email"
                name="email"
                type="email"
                className={`input-field pl-10 ${errors.email ? 'ring-2 ring-red-500' : ''}`}
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-surface-500">
                <LockIcon className="h-5 w-5" />
              </span>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                className={`input-field pl-10 ${errors.password ? 'ring-2 ring-red-500' : ''}`}
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-surface-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-surface-500">
                <LockIcon className="h-5 w-5" />
              </span>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                className={`input-field pl-10 ${errors.confirmPassword ? 'ring-2 ring-red-500' : ''}`}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
          </div>
          
          <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        
        <p className="text-center mt-4 text-surface-600 dark:text-surface-400">
          Already have an account? <Link to="/login" className="text-primary hover:underline">Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;