import { useState } from 'react';
import { format } from 'date-fns';
import { getIcon } from '../utils/iconUtils';
import { ToastContainer, toast } from 'react-toastify';

// Mock application data
const applicationData = [
  {
    id: 1,
    companyName: 'Tech Innovations Inc.',
    position: 'Senior Frontend Developer',
    location: 'San Francisco, CA',
    dateApplied: '2023-07-15',
    status: 'Applied',
    logo: '🏢'
  },
  {
    id: 2,
    companyName: 'Global Systems',
    position: 'UI/UX Designer',
    location: 'Remote',
    dateApplied: '2023-07-20',
    status: 'Interviewing',
    logo: '🌐'
  },
  {
    id: 3,
    companyName: 'Creative Solutions',
    position: 'Full Stack Developer',
    location: 'New York, NY',
    dateApplied: '2023-08-05',
    status: 'Rejected',
    logo: '💻'
  },
  {
    id: 4,
    companyName: 'Startup Hub',
    position: 'Product Manager',
    location: 'Austin, TX',
    dateApplied: '2023-08-12',
    status: 'Offer',
    logo: '🚀'
  },
  {
    id: 5,
    companyName: 'Data Analytics Pro',
    position: 'Data Scientist',
    location: 'Boston, MA',
    dateApplied: '2023-08-18',
    status: 'Applied',
    logo: '📊'
  }
];

const MyApplications = () => {
  const [applications, setApplications] = useState(applicationData);
  const [filter, setFilter] = useState('All');
  const [viewApplication, setViewApplication] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  
  
  // Icons
  const BriefcaseIcon = getIcon('briefcase');
  const CheckCircleIcon = getIcon('check-circle');
  const XCircleIcon = getIcon('x-circle');
  const ClockIcon = getIcon('clock');
  const AlertCircleIcon = getIcon('alert-circle');
  const FilterIcon = getIcon('filter');
  const ExternalLinkIcon = getIcon('external-link');
  const TrashIcon = getIcon('trash');
  const XIcon = getIcon('x');
  
  // Status badge component
  const StatusBadge = ({ status }) => {
    let color = '';
    let icon = null;
    
    switch(status) {
      case 'Applied':
        color = 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
        icon = <ClockIcon className="w-4 h-4 mr-1" />;
        break;
      case 'Interviewing':
        color = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
        icon = <AlertCircleIcon className="w-4 h-4 mr-1" />;
        break;
      case 'Rejected':
        color = 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
        icon = <XCircleIcon className="w-4 h-4 mr-1" />;
        break;
      case 'Offer':
        color = 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
        icon = <CheckCircleIcon className="w-4 h-4 mr-1" />;
        break;
      default:
        color = 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
        {icon}
        {status}
      </span>
    );
  };
  
  // Handle delete application
  const handleDelete = (id) => {
    setApplications(applications.filter(app => app.id !== id));
    setDeleteConfirmation(null);
    toast.success("Application successfully deleted!");
  };
  
  // Handle view application
  const handleView = (application) => {
    setViewApplication(application);
  };
  
  // Show delete confirmation
  const confirmDelete = (application) => {
    setDeleteConfirmation(application);
  };
  
  // Filter applications based on selected filter
  const filteredApplications = filter === 'All' 
    ? applications 
    : applications.filter(app => app.status === filter);
  
  return (
    <>
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
        theme="light"
      />
      
      {/* Main Content */}
    <div className="container mx-auto px-4 md:px-6 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">My Applications</h1>
          <p className="text-surface-600 dark:text-surface-400">
            Track and manage all your job applications
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex items-center">
          <div className="flex items-center bg-surface-100 dark:bg-surface-700 rounded-lg px-3 py-2">
            <FilterIcon className="w-5 h-5 text-surface-500 dark:text-surface-400 mr-2" />
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-transparent border-0 text-surface-700 dark:text-surface-300 focus:ring-0 focus:outline-none"
            >
              <option value="All">All Applications</option>
              <option value="Applied">Applied</option>
              <option value="Interviewing">Interviewing</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>
      
      {filteredApplications.length === 0 ? (
        <div className="card text-center py-12">
          <BriefcaseIcon className="w-16 h-16 mx-auto text-surface-400 dark:text-surface-600 mb-4" />
          <h3 className="text-xl font-medium mb-2">No applications found</h3>
          <p className="text-surface-600 dark:text-surface-400 mb-6">
            {filter === 'All' 
              ? "You haven't applied to any jobs yet."
              : `You don't have any applications with "${filter}" status.`}
          </p>
          <a href="/" className="btn btn-primary">
            Find Jobs to Apply
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((application) => (
            <div key={application.id} className="card flex flex-col md:flex-row md:items-center">
              <div className="flex-shrink-0 mr-4 text-4xl">
                {application.logo}
              </div>
              <div className="flex-grow md:flex md:justify-between md:items-center">
                <div className="mt-4 md:mt-0">
                  <h3 className="font-medium">{application.position}</h3>
                  <p className="text-surface-600 dark:text-surface-400">{application.companyName}</p>
                  <p className="text-sm text-surface-500 dark:text-surface-500">{application.location}</p>
                </div>
                <div className="mt-2 md:mt-0 md:ml-6 flex flex-col items-start">
                  <StatusBadge status={application.status} />
                  <span className="text-sm text-surface-500 dark:text-surface-500 mt-1">
                    Applied on {format(new Date(application.dateApplied), 'MMM d, yyyy')}
                  </span>
                </div>
              </div>
              <div className="mt-4 md:mt-0 md:ml-6 flex space-x-2">
                <button 
                  onClick={() => handleView(application)} 
                  className="btn-outline text-sm py-1 px-3 flex items-center"
                >
                  <ExternalLinkIcon className="w-4 h-4 mr-1" /> View
                </button>
                <button 
                  onClick={() => confirmDelete(application)} 
                  className="text-red-500 border border-red-500 rounded-lg py-1 px-3 text-sm hover:bg-red-500 hover:text-white transition-colors duration-200 flex items-center"
                >
                  <TrashIcon className="w-4 h-4 mr-1" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    
    {/* View Application Modal */}
    {viewApplication && (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div className="bg-white dark:bg-surface-800 rounded-lg p-6 m-4 max-w-2xl w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Application Details</h2>
            <button 
              onClick={() => setViewApplication(null)}
              className="text-surface-500 hover:text-surface-700 dark:hover:text-surface-300"
            >
              <XIcon className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="text-4xl mr-4">{viewApplication.logo}</div>
              <div>
                <h3 className="text-lg font-medium">{viewApplication.position}</h3>
                <p className="text-surface-600 dark:text-surface-400">{viewApplication.companyName}</p>
              </div>
            </div>
            <StatusBadge status={viewApplication.status} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-surface-500 dark:text-surface-500">Location:</p>
                <p>{viewApplication.location}</p>
              </div>
              <div>
                <p className="text-sm text-surface-500 dark:text-surface-500">Date Applied:</p>
                <p>{format(new Date(viewApplication.dateApplied), 'MMM d, yyyy')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )}
    
    {/* Delete Confirmation Modal */}
    {deleteConfirmation && (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div className="bg-white dark:bg-surface-800 rounded-lg p-6 max-w-md w-full">
          <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
          <p className="mb-6">Are you sure you want to delete your application for <strong>{deleteConfirmation.position}</strong> at <strong>{deleteConfirmation.companyName}</strong>?</p>
          <div className="flex justify-end space-x-3">
            <button onClick={() => setDeleteConfirmation(null)} className="btn-outline">
              Cancel
            </button>
            <button onClick={() => handleDelete(deleteConfirmation.id)} className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg">
              Delete
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default MyApplications;