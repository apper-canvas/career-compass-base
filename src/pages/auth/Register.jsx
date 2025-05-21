import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getIcon } from '../../utils/iconUtils';
import { useAuth } from '../../contexts/AuthContext';

const Register = () => {
  const [searchParams] = useSearchParams();
  const defaultRole = searchParams.get('role') === 'employer' ? 'employer' : 'candidate';
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: defaultRole,
    companyName: '',
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  // Icons
  const UserIcon = getIcon('user');
  const EnvelopeIcon = getIcon('mail');
  const LockIcon = getIcon('lock');
  const BriefcaseIcon = getIcon('briefcase');
  const BuildingIcon = getIcon('building');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate first name
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    // Validate last name
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email address is invalid';
    }
    
    // Validate password
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    // Validate confirm password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    // Validate company name if employer
    if (formData.role === 'employer' && !formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      await register(
        formData.email,
        formData.password,
        formData.firstName,
        formData.lastName,
        formData.role,
        formData.companyName
      );
      
      // Redirect based on role
      if (formData.role === 'employer') {
        navigate('/employer/dashboard');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="card auth-form-shadow"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Create your account</h2>
            <p className="text-surface-600 dark:text-surface-400">
              Join CareerCompass to find your dream job
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium mb-1">First Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-surface-500 dark:text-surface-400">
                    <UserIcon className="h-5 w-5" />
                  </span>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`pl-10 input-field ${errors.firstName ? 'border-red-500 dark:border-red-500' : ''}`}
                    placeholder="John"
                  />
                </div>
                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium mb-1">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`input-field ${errors.lastName ? 'border-red-500 dark:border-red-500' : ''}`}
                  placeholder="Doe"
                />
                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
              </div>
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-surface-500 dark:text-surface-400">
                  <EnvelopeIcon className="h-5 w-5" />
                </span>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`pl-10 input-field ${errors.email ? 'border-red-500 dark:border-red-500' : ''}`}
                  placeholder="john.doe@example.com"
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-surface-500 dark:text-surface-400">
                  <LockIcon className="h-5 w-5" />
                </span>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`pl-10 input-field ${errors.password ? 'border-red-500 dark:border-red-500' : ''}`}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">Confirm Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-surface-500 dark:text-surface-400">
                  <LockIcon className="h-5 w-5" />
                </span>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`pl-10 input-field ${errors.confirmPassword ? 'border-red-500 dark:border-red-500' : ''}`}
                  placeholder="••••••••"
                />
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Account Type</label>
              <div className="grid grid-cols-2 gap-4 mt-1">
                <label className={`flex items-center p-3 border ${formData.role === 'candidate' ? 'border-primary bg-primary bg-opacity-10' : 'border-surface-200 dark:border-surface-700'} rounded-lg cursor-pointer transition-colors`}>
                  <input
                    type="radio"
                    name="role"
                    value="candidate"
                    checked={formData.role === 'candidate'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className="flex items-center">
                    <UserIcon className={`h-5 w-5 mr-2 ${formData.role === 'candidate' ? 'text-primary' : 'text-surface-500 dark:text-surface-400'}`} />
                    <div>
                      <span className="font-medium block">Job Seeker</span>
                      <span className="text-xs text-surface-500 dark:text-surface-400">Find and apply to jobs</span>
                    </div>
                  </div>
                </label>
                <label className={`flex items-center p-3 border ${formData.role === 'employer' ? 'border-primary bg-primary bg-opacity-10' : 'border-surface-200 dark:border-surface-700'} rounded-lg cursor-pointer transition-colors`}>
                  <input
                    type="radio"
                    name="role"
                    value="employer"
                    checked={formData.role === 'employer'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className="flex items-center">
                    <BriefcaseIcon className={`h-5 w-5 mr-2 ${formData.role === 'employer' ? 'text-primary' : 'text-surface-500 dark:text-surface-400'}`} />
                    <div>
                      <span className="font-medium block">Employer</span>
                      <span className="text-xs text-surface-500 dark:text-surface-400">Post jobs & hire talent</span>
                    </div>
                  </div>
                </label>
              </div>
            </div>
            
            {formData.role === 'employer' && (
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium mb-1">Company Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-surface-500 dark:text-surface-400">
                    <BuildingIcon className="h-5 w-5" />
                  </span>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className={`pl-10 input-field ${errors.companyName ? 'border-red-500 dark:border-red-500' : ''}`}
                    placeholder="Your Company Inc."
                  />
                </div>
                {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName}</p>}
              </div>
            )}
            
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="btn btn-primary w-full"
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </button>
            
            <p className="text-center text-sm text-surface-600 dark:text-surface-400 mt-4">
              Already have an account? <Link to="/login" className="text-primary hover:text-primary-dark font-medium">Sign in</Link>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;