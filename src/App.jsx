import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { getIcon } from './utils/iconUtils';
import Home from './pages/Home';
import NotFound from './pages/NotFound';

// Navigation component
const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

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
            <a href="/" className="font-medium text-surface-600 dark:text-surface-300 hover:text-primary dark:hover:text-primary-light">
              Find Jobs
            </a>
            <a href="/my-applications" className="font-medium text-surface-600 dark:text-surface-300 hover:text-primary dark:hover:text-primary-light">
              My Applications
            </a>
            <a href="/interview-tips" className="font-medium text-surface-600 dark:text-surface-300 hover:text-primary dark:hover:text-primary-light">
              Interview Tips
            </a>
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
              href="/"
              className="block px-3 py-2 rounded-lg text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700"
              onClick={() => setIsOpen(false)}
            >
              Find Jobs
            </a>
            <a 
              href="/my-applications"
              className="block px-3 py-2 rounded-lg text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700"
              onClick={() => setIsOpen(false)}
            >
              My Applications
            </a>
            <a 
              href="/interview-tips"
              className="block px-3 py-2 rounded-lg text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700"
              onClick={() => setIsOpen(false)}
            >
              Interview Tips
            </a>
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
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">CareerCompass</h3>
            <p className="text-surface-600 dark:text-surface-400">
              Find your dream job with our advanced job search platform.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-surface-600 dark:text-surface-400 hover:text-primary dark:hover:text-primary-light">Find Jobs</a></li>
              <li><a href="/my-applications" className="text-surface-600 dark:text-surface-400 hover:text-primary dark:hover:text-primary-light">My Applications</a></li>
              <li><a href="/interview-tips" className="text-surface-600 dark:text-surface-400 hover:text-primary dark:hover:text-primary-light">Interview Tips</a></li>
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
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      
      <Footer />
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
}

export default App;