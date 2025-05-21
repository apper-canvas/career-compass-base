import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getIcon } from '../utils/iconUtils';

const NotFound = () => {
  const AlertCircleIcon = getIcon('alert-circle');
  const HomeIcon = getIcon('home');
  
  return (
    <div className="container mx-auto px-4 md:px-6 py-16 md:py-24">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg mx-auto text-center"
      >
        <div className="flex justify-center mb-6">
          <motion.div 
            animate={{ rotate: [0, 5, -5, 5, 0] }}
            transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
          >
            <AlertCircleIcon className="h-24 w-24 text-accent" />
          </motion.div>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold mb-4">404</h1>
        <h2 className="text-2xl md:text-3xl font-semibold mb-6">Page Not Found</h2>
        
        <p className="text-lg text-surface-700 dark:text-surface-300 mb-8">
          The page you are looking for might have been removed, had its name changed,
          or is temporarily unavailable.
        </p>
        
        <Link 
          to="/"
          className="btn btn-primary inline-flex items-center"
        >
          <HomeIcon className="h-5 w-5 mr-2" />
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;