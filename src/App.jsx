import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { getIcon } from './utils/iconUtils';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import InterviewTips from './pages/InterviewTips';
import MyApplications from './pages/MyApplications';
import Login from './pages/auth/Login';
import JobDetail from './pages/JobDetail';
import UserProfile from './pages/UserProfile';

// Navigation component
const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  // Update theme based on user preference
  useEffect(() => {
    if (localStorage.theme === 'dark' || 
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setIsDark(true);
    }
  };

  const MenuIcon = getIcon('menu');
  const XIcon = getIcon('x');
  const SunIcon = getIcon('sun');
  const MoonIcon = getIcon('moon');
  const BriefcaseIcon = getIcon('briefcase');
  const UserIcon = getIcon('user');
  
  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  // Profile button click
  const handleProfileClick = () => currentUser ? navigate('/profile') : navigate('/login');

  return (
    <nav className="bg-white dark:bg-surface-800 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 md:px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <BriefcaseIcon className="h-7 w-7 text-primary mr-2" />
            <span className="text-xl md:text-2xl font-bold text-primary">CareerCompass</span>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center gap-4 md:hidden">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300"
              aria-label="Toggle dark mode"
            >
              {isDark ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-full bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300"
              aria-label="Open menu"
            >
              {isOpen ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
            </button>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="font-medium text-surface-600 dark:text-surface-300 hover:text-primary dark:hover:text-primary-light">
              Find Jobs
            </Link>
            
            {currentUser && (
              <Link to="/my-applications" className="font-medium text-surface-600 dark:text-surface-300 hover:text-primary dark:hover:text-primary-light">
              My Applications
              </Link>
            )}
            
            <Link to="/interview-tips" className="font-medium text-surface-600 dark:text-surface-300 hover:text-primary dark:hover:text-primary-light">
              Interview Tips
            </Link>
            
            {currentUser ? (
              <div className="relative group">
                <button className="flex items-center gap-2 font-medium text-surface-600 dark:text-surface-300 hover:text-primary dark:hover:text-primary-light">
                  <UserIcon className="h-4 w-4" />
                  {currentUser.firstName}
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-surface-800 rounded-md shadow-lg overflow-hidden z-20 hidden group-hover:block">
                  <Link to="/profile" className="block px-4 py-2 text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700">My Profile</Link>
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700">Log Out</button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="font-medium text-surface-600 dark:text-surface-300 hover:text-primary dark:hover:text-primary-light">
                Sign In
              </Link>
            )}
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDark ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden mt-4 py-2 space-y-2"
          >
            <a 
              onClick={() => { setIsOpen(false); navigate('/'); }}
              className="block px-3 py-2 rounded-lg text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700"
            >
              Find Jobs
            </a>
            
            {currentUser && (
              <a 
                onClick={() => { setIsOpen(false); navigate('/my-applications'); }}
                className="block px-3 py-2 rounded-lg text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700"
              >
                My Applications
              </a>
            )}
            
            <a
              onClick={() => { setIsOpen(false); navigate('/interview-tips'); }}
              className="block px-3 py-2 rounded-lg text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700"
            >
              Interview Tips
            </a>
            
            {currentUser ? (
              <>
                <a 
                  onClick={() => { setIsOpen(false); navigate('/profile'); }}
                  className="block px-3 py-2 rounded-lg text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700"
                >
                  My Profile <UserIcon className="inline h-4 w-4 ml-1" />
                </a>
                <a 
                  onClick={() => { setIsOpen(false); handleLogout(); }}
                  className="block px-3 py-2 rounded-lg text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700"
                >
                  Log Out
                </a>
              </>
            ) : (
              <a onClick={() => { setIsOpen(false); navigate('/login'); }} className="block px-3 py-2 rounded-lg text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700">
                Sign In
              </a>
            )}
          </motion.div>
        )}
      </div>
    </nav>
  );
};

// Footer component
const Footer = () => {
  return (
    <footer className="bg-white dark:bg-surface-800 py-8 mt-12">
      <div className="container mx-auto px-4 md:px-6 text-center md:text-left">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">CareerCompass</h3>
            <p className="text-surface-600 dark:text-surface-400 text-sm md:text-base">
              Find your dream job with our advanced job search platform.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-surface-600 dark:text-surface-400 hover:text-primary dark:hover:text-primary-light">Find Jobs</a></li>
              <li><a href="/my-applications" className="text-surface-600 dark:text-surface-400 hover:text-primary dark:hover:text-primary-light">My Applications</a></li>
              <li><a href="/interview-tips" className="text-surface-600 dark:text-surface-400 hover:text-primary dark:hover:text-primary-light">Interview Tips</a></li>
              <li><a href="/login" className="text-surface-600 dark:text-surface-400 hover:text-primary dark:hover:text-primary-light">Sign In</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <p className="text-surface-600 dark:text-surface-400">
              support@careercompass.io<br />
              (555) 123-4567
            </p>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-surface-200 dark:border-surface-700">
          <p className="text-center text-surface-500 dark:text-surface-500">
            &copy; {new Date().getFullYear()} CareerCompass. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <Navigation />
        
        <main className="flex-grow">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/interview-tips" element={<InterviewTips />} />
            <Route path="/job/:id" element={<JobDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={
              <React.lazy(() => import('./pages/auth/Register'))
            } />
            
            
            {/* Protected routes */}
            <Route path="/profile" element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            } />
            <Route path="/my-applications" element={
              <ProtectedRoute>
                <MyApplications />
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        
        <Footer />
        
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false}
          newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored" />
      </div>
    </AuthProvider>
  );
}

export default App;