import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getIcon } from '../../utils/iconUtils';
import { useAuth } from '../../contexts/AuthContext';
import { useJob } from '../../contexts/JobContext';
import { toast } from 'react-toastify';

const ManageJobs = () => {
  const { currentUser } = useAuth();
  const { getJobsByEmployer, toggleJobStatus, deleteJob } = useJob();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('newest');
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirmJobId, setDeleteConfirmJobId] = useState(null);

  // Icons
  const PlusIcon = getIcon('plus');
  const SearchIcon = getIcon('search');
  const EditIcon = getIcon('edit');
  const EyeIcon = getIcon('eye');
  const TrashIcon = getIcon('trash');
  const CheckCircleIcon = getIcon('check-circle');
  const XCircleIcon = getIcon('x-circle');
  const UsersIcon = getIcon('users');
  const CalendarIcon = getIcon('calendar');
  const BriefcaseIcon = getIcon('briefcase');
  const ArrowUpDownIcon = getIcon('arrow-up-down');

  // Fetch employer's jobs
  useEffect(() => {
    if (currentUser) {
      const fetchedJobs = getJobsByEmployer(currentUser.id);
      setJobs(fetchedJobs);
      setLoading(false);
    }
  }, [currentUser, getJobsByEmployer]);

  // Handle job status toggle
  const handleToggleStatus = async (jobId) => {
    try {
      const updatedJob = await toggleJobStatus(jobId);
      setJobs(jobs.map(job => job.id === jobId ? updatedJob : job));
    } catch (error) {
      console.error('Error toggling job status:', error);
      toast.error(error.message || 'Failed to update job status');
    }
  };

  // Handle job deletion
  const handleDeleteJob = async (jobId) => {
    try {
      await deleteJob(jobId);
      setJobs(jobs.filter(job => job.id !== jobId));
      setDeleteConfirmJobId(null);
      toast.success('Job deleted successfully');
    } catch (error) {
      console.error('Error deleting job:', error);
      toast.error(error.message || 'Failed to delete job');
    }
  };

  // Filter and sort jobs
  const filteredAndSortedJobs = jobs
    .filter(job => {
      // Apply status filter
      if (filter === 'active' && job.status !== 'active') return false;
      if (filter === 'inactive' && job.status !== 'inactive') return false;
      
      // Apply search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          job.title.toLowerCase().includes(searchLower) ||
          job.location.toLowerCase().includes(searchLower) ||
          job.company.toLowerCase().includes(searchLower)
        );
      }
      
      return true;
    })
    .sort((a, b) => {
      // Apply sorting
      if (sort === 'newest') {
        return new Date(b.postedDate) - new Date(a.postedDate);
      } else if (sort === 'oldest') {
        return new Date(a.postedDate) - new Date(b.postedDate);
      } else if (sort === 'title') {
        return a.title.localeCompare(b.title);
      } else if (sort === 'applications') {
        return (b.applications || 0) - (a.applications || 0);
      }
      return 0;
    });

  // Delete confirmation modal
  const DeleteConfirmationModal = ({ jobId, jobTitle }) => (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity">
          <div className="absolute inset-0 bg-surface-900 opacity-75"></div>
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>&#8203;
        <div className="inline-block align-bottom bg-white dark:bg-surface-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white dark:bg-surface-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <TrashIcon className="h-6 w-6 text-red-600" />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-surface-900 dark:text-white">
                  Delete Job Listing
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-surface-600 dark:text-surface-400">
                    Are you sure you want to delete the job "<span className="font-medium">{jobTitle}</span>"? This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-surface-50 dark:bg-surface-800 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={() => handleDeleteJob(jobId)}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Delete
            </button>
            <button
              type="button"
              onClick={() => setDeleteConfirmJobId(null)}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-surface-300 dark:border-surface-700 shadow-sm px-4 py-2 bg-white dark:bg-surface-700 text-base font-medium text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      {deleteConfirmJobId && (
        <DeleteConfirmationModal 
          jobId={deleteConfirmJobId} 
          jobTitle={jobs.find(job => job.id === deleteConfirmJobId)?.title || ''}
        />
      )}
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 flex justify-between items-start"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Manage Job Listings</h1>
          <p className="text-surface-600 dark:text-surface-400">
            View, edit, and control all your job listings
          </p>
        </div>
        <Link to="/employer/post-job" className="btn btn-primary flex items-center">
          <PlusIcon className="h-4 w-4 mr-2" />
          Post New Job
        </Link>
      </motion.div>

      <div className="card mb-8">
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400 h-5 w-5" />
            <input 
              type="text"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 input-field"
            />
          </div>
          
          {/* Filter */}
          <div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="select-field"
            >
              <option value="all">All Jobs</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
          
          {/* Sort */}
          <div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="select-field"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Title A-Z</option>
              <option value="applications">Most Applications</option>
            </select>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-solid border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
              <p className="mt-4 text-surface-600 dark:text-surface-400">Loading your jobs...</p>
            </div>
          </div>
        ) : filteredAndSortedJobs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-surface-200 dark:divide-surface-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Applications</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Posted Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-200 dark:divide-surface-700">
                {filteredAndSortedJobs.map((job) => (
                  <tr key={job.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <BriefcaseIcon className="h-5 w-5 text-primary mr-2" />
                        <div className="text-sm font-medium">{job.title}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button 
                        onClick={() => handleToggleStatus(job.id)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${job.status === 'active' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}`}
                      >
                        {job.status === 'active' 
                          ? <><CheckCircleIcon className="h-3 w-3 mr-1" /> Active</> 
                          : <><XCircleIcon className="h-3 w-3 mr-1" /> Inactive</>}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{job.location}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center">
                        <UsersIcon className="h-4 w-4 text-surface-500 dark:text-surface-400 mr-1" />
                        {job.applications || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 text-surface-500 dark:text-surface-400 mr-1" />
                        {new Date(job.postedDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        <Link to={`/employer/edit-job/${job.id}`} className="text-primary hover:text-primary-dark">
                          <EditIcon className="h-5 w-5" />
                        </Link>
                        <Link to={`/job/${job.id}`} className="text-secondary hover:text-secondary-dark">
                          <EyeIcon className="h-5 w-5" />
                        </Link>
                        <button 
                          onClick={() => setDeleteConfirmJobId(job.id)}
                          className="text-surface-500 hover:text-red-500"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <BriefcaseIcon className="h-12 w-12 mx-auto mb-4 text-surface-400" />
            <h3 className="text-lg font-medium mb-2">No jobs found</h3>
            <p className="text-surface-500 dark:text-surface-400 mb-6">
              {searchTerm 
                ? "No jobs match your search criteria. Try adjusting your search."
                : filter !== 'all' 
                  ? `No ${filter} jobs found. Try changing the filter.`
                  : "You haven't posted any jobs yet."}
            </p>
            <Link to="/employer/post-job" className="btn btn-primary inline-flex items-center">
              <PlusIcon className="h-4 w-4 mr-2" />
              Post Your First Job
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageJobs;