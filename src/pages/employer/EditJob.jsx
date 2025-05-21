import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getIcon } from '../../utils/iconUtils';
import { useAuth } from '../../contexts/AuthContext';
import { useJob } from '../../contexts/JobContext';
import { toast } from 'react-toastify';

const jobTypes = ["Full-time", "Part-time", "Contract", "Internship", "Remote"];
const industries = [
  "Technology", "Healthcare", "Finance", "Education", "Marketing", 
  "Design", "Engineering", "Sales", "Customer Service", "Human Resources",
  "Manufacturing", "Retail", "Construction", "Legal", "Food Service",
  "Transportation", "Media", "Non-profit", "Real Estate", "Other"
];

const EditJob = () => {
  const { currentUser } = useAuth();
  const { getJobById, updateJob, deleteJob } = useJob();
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [jobData, setJobData] = useState({
    title: '',
    location: '',
    type: 'Full-time',
    salary: '',
    description: '',
    requirements: '',
    industry: 'Technology',
    responsibilities: [''],
    qualifications: [''],
    applicationEmail: '',
    applicationUrl: '',
    expiryDate: '',
    company: ''
  });

  // Icons
  const BriefcaseIcon = getIcon('briefcase');
  const MapPinIcon = getIcon('map-pin');
  const DollarSignIcon = getIcon('dollar-sign');
  const ClockIcon = getIcon('clock');
  const BuildingIcon = getIcon('building');
  const PlusIcon = getIcon('plus');
  const MinusIcon = getIcon('minus');
  const ArrowLeftIcon = getIcon('arrow-left');
  const ArrowRightIcon = getIcon('arrow-right');
  const EyeIcon = getIcon('eye');
  const EditIcon = getIcon('edit');
  const SaveIcon = getIcon('save');
  const TrashIcon = getIcon('trash');
  const XIcon = getIcon('x');

  // Fetch job data
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const job = getJobById(id);
        
        if (!job) {
          toast.error("Job not found");
          navigate('/employer/manage-jobs');
          return;
        }
        
        // Check if the current user is the job owner
        if (job.employerId !== currentUser?.id) {
          toast.error("You don't have permission to edit this job");
          navigate('/employer/manage-jobs');
          return;
        }
        
        // Format date if exists
        let formattedJob = { ...job };
        if (job.expiryDate) {
          const date = new Date(job.expiryDate);
          formattedJob.expiryDate = date.toISOString().split('T')[0];
        }
        
        // Ensure responsibilities and qualifications are arrays
        if (!Array.isArray(formattedJob.responsibilities)) {
          formattedJob.responsibilities = formattedJob.responsibilities 
            ? [formattedJob.responsibilities] 
            : [''];
        }
        
        if (!Array.isArray(formattedJob.qualifications)) {
          formattedJob.qualifications = formattedJob.qualifications 
            ? [formattedJob.qualifications] 
            : [''];
        }
        
        setJobData(formattedJob);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching job:', error);
        toast.error("Failed to load job details");
        navigate('/employer/manage-jobs');
      }
    };
    
    fetchJob();
  }, [id, currentUser, getJobById, navigate]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setJobData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field if any
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle array input changes (responsibilities, qualifications)
  const handleArrayInputChange = (index, field, value) => {
    const updatedArray = [...jobData[field]];
    updatedArray[index] = value;
    
    setJobData(prev => ({
      ...prev,
      [field]: updatedArray
    }));
  };

  // Add new item to an array field
  const addArrayItem = (field) => {
    setJobData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  // Remove item from an array field
  const removeArrayItem = (field, index) => {
    if (jobData[field].length > 1) {
      const updatedArray = [...jobData[field]];
      updatedArray.splice(index, 1);
      
      setJobData(prev => ({
        ...prev,
        [field]: updatedArray
      }));
    } else {
      toast.info("You need at least one item in this list");
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    // Required fields validation for step 1
    if (step === 1) {
      if (!jobData.title.trim()) newErrors.title = "Job title is required";
      if (!jobData.location.trim()) newErrors.location = "Location is required";
      if (!jobData.salary.trim()) newErrors.salary = "Salary information is required";
      if (!jobData.description.trim()) newErrors.description = "Job description is required";
      if (!jobData.requirements.trim()) newErrors.requirements = "Requirements are required";
      if (!jobData.company.trim()) newErrors.company = "Company name is required";
    }
    
    // Required fields validation for step 2
    if (step === 2) {
      if (jobData.responsibilities.some(item => !item.trim())) {
        newErrors.responsibilities = "All responsibilities must be filled";
      }
      
      if (jobData.qualifications.some(item => !item.trim())) {
        newErrors.qualifications = "All qualifications must be filled";
      }
      
      if (!jobData.applicationEmail.trim() && !jobData.applicationUrl.trim()) {
        newErrors.applicationEmail = "Either email or URL for applications is required";
        newErrors.applicationUrl = "Either email or URL for applications is required";
      }
      
      if (jobData.applicationEmail && !/^\S+@\S+\.\S+$/.test(jobData.applicationEmail)) {
        newErrors.applicationEmail = "Please enter a valid email address";
      }
      
      if (jobData.applicationUrl && !/^https?:\/\/\S+/.test(jobData.applicationUrl)) {
        newErrors.applicationUrl = "Please enter a valid URL (starting with http:// or https://)";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle next step
  const handleNextStep = () => {
    if (validateForm()) {
      setStep(2);
      window.scrollTo(0, 0);
    }
  };

  // Handle previous step
  const handlePrevStep = () => {
    setStep(1);
    window.scrollTo(0, 0);
  };

  // Toggle preview mode
  const togglePreview = () => {
    if (!previewMode && !validateForm()) {
      return;
    }
    setPreviewMode(!previewMode);
    window.scrollTo(0, 0);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly");
      return;
    }
    
    try {
      setIsSubmitting(true);
      await updateJob(id, jobData);
      toast.success("Job updated successfully");
      navigate('/employer/manage-jobs');
    } catch (error) {
      console.error('Error updating job:', error);
      toast.error(error.message || "Failed to update job. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle job deletion
  const handleDeleteJob = async () => {
    try {
      setIsSubmitting(true);
      await deleteJob(id);
      toast.success("Job deleted successfully");
      navigate('/employer/manage-jobs');
    } catch (error) {
      console.error('Error deleting job:', error);
      toast.error(error.message || "Failed to delete job. Please try again.");
    } finally {
      setIsSubmitting(false);
      setShowDeleteConfirmation(false);
    }
  };

  // Delete confirmation modal
  const DeleteConfirmationModal = () => (
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
                    Are you sure you want to delete this job listing? This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-surface-50 dark:bg-surface-800 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={handleDeleteJob}
              disabled={isSubmitting}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              {isSubmitting ? "Deleting..." : "Delete"}
            </button>
            <button
              type="button"
              onClick={() => setShowDeleteConfirmation(false)}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-surface-300 dark:border-surface-700 shadow-sm px-4 py-2 bg-white dark:bg-surface-700 text-base font-medium text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Preview component
  const JobPreview = () => (
    <div className="bg-white dark:bg-surface-800 rounded-xl shadow-lg p-6 border border-surface-200 dark:border-surface-700">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-3">{jobData.title}</h1>
        <div className="flex flex-wrap gap-4 text-surface-600 dark:text-surface-400 mb-4">
          <div className="flex items-center">
            <BuildingIcon className="h-4 w-4 mr-1" />
            <span>{jobData.company}</span>
          </div>
          <div className="flex items-center">
            <MapPinIcon className="h-4 w-4 mr-1" />
            <span>{jobData.location}</span>
          </div>
          <div className="flex items-center">
            <BriefcaseIcon className="h-4 w-4 mr-1" />
            <span>{jobData.type}</span>
          </div>
          <div className="flex items-center">
            <DollarSignIcon className="h-4 w-4 mr-1" />
            <span>{jobData.salary}</span>
          </div>
        </div>
        
        <div className="mb-6">
          <span className="inline-block px-3 py-1 bg-surface-100 dark:bg-surface-700 text-sm rounded-full">
            {jobData.industry}
          </span>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Job Description</h2>
          <p className="whitespace-pre-line">{jobData.description}</p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Requirements</h2>
          <p className="whitespace-pre-line">{jobData.requirements}</p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Responsibilities</h2>
          <ul className="list-disc pl-5 space-y-2">
            {jobData.responsibilities.map((item, index) => (
              item.trim() && <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Qualifications</h2>
          <ul className="list-disc pl-5 space-y-2">
            {jobData.qualifications.map((item, index) => (
              item.trim() && <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">How to Apply</h2>
          {jobData.applicationEmail && (
            <p>Email your resume and cover letter to: <a href={`mailto:${jobData.applicationEmail}`} className="text-primary">{jobData.applicationEmail}</a></p>
          )}
          {jobData.applicationUrl && (
            <p>Apply online at: <a href={jobData.applicationUrl} target="_blank" rel="noopener noreferrer" className="text-primary">{jobData.applicationUrl}</a></p>
          )}
          {jobData.expiryDate && (
            <p className="mt-2 text-surface-500 dark:text-surface-400">
              <ClockIcon className="inline h-4 w-4 mr-1" />
              Applications close: {new Date(jobData.expiryDate).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-between pt-4 border-t border-surface-200 dark:border-surface-700">
        <button 
          onClick={togglePreview}
          className="btn btn-outline flex items-center"
        >
          <EditIcon className="h-4 w-4 mr-2" />
          Edit Job
        </button>
        <div className="flex space-x-3">
          <button 
            onClick={() => setShowDeleteConfirmation(true)}
            className="btn bg-red-500 hover:bg-red-600 text-white flex items-center"
          >
            <TrashIcon className="h-4 w-4 mr-2" />
            Delete
          </button>
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="btn btn-primary flex items-center"
          >
            {isSubmitting ? "Saving..." : (
              <>
                <SaveIcon className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="card flex justify-center items-center h-64">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-solid border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-4 text-surface-600 dark:text-surface-400">Loading job details...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      {showDeleteConfirmation && <DeleteConfirmationModal />}
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 flex justify-between items-start"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Edit Job Listing</h1>
          <p className="text-surface-600 dark:text-surface-400">
            Update your job listing details
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowDeleteConfirmation(true)}
          className="btn bg-red-500 hover:bg-red-600 text-white flex items-center"
        >
          <TrashIcon className="h-4 w-4 mr-2" />
          Delete Job
        </button>
      </motion.div>

      {previewMode ? (
        <JobPreview />
      ) : (
        <div className="card">
          <div className="mb-6 flex justify-between items-center">
            <div className="flex items-center">
              <div className={`flex items-center justify-center h-8 w-8 rounded-full ${step === 1 ? 'bg-primary' : 'bg-surface-200 dark:bg-surface-700'} text-white font-semibold mr-2`}>1</div>
              <span className="mr-4">Basic Information</span>
              <div className="h-px w-12 bg-surface-300 dark:bg-surface-600"></div>
              <div className={`flex items-center justify-center h-8 w-8 rounded-full ${step === 2 ? 'bg-primary' : 'bg-surface-200 dark:bg-surface-700'} text-white font-semibold mx-2`}>2</div>
              <span>Additional Details</span>
            </div>
            <button
              type="button"
              onClick={togglePreview}
              className="btn btn-outline flex items-center"
            >
              <EyeIcon className="h-4 w-4 mr-2" />
              Preview
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="space-y-6">
                {/* Step 1: Basic Information - Same as PostJob.jsx */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium mb-2">
                    Job Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={jobData.title}
                    onChange={handleInputChange}
                    placeholder="e.g. Senior Frontend Developer"
                    className={`input-field ${errors.title ? 'border-red-500 dark:border-red-500' : ''}`}
                  />
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium mb-2">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={jobData.company}
                    onChange={handleInputChange}
                    placeholder="Your company name"
                    className={`input-field ${errors.company ? 'border-red-500 dark:border-red-500' : ''}`}
                  />
                  {errors.company && <p className="text-red-500 text-sm mt-1">{errors.company}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium mb-2">
                      Location <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={jobData.location}
                      onChange={handleInputChange}
                      placeholder="e.g. San Francisco, CA or Remote"
                      className={`input-field ${errors.location ? 'border-red-500 dark:border-red-500' : ''}`}
                    />
                    {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                  </div>

                  <div>
                    <label htmlFor="type" className="block text-sm font-medium mb-2">
                      Job Type
                    </label>
                    <select
                      id="type"
                      name="type"
                      value={jobData.type}
                      onChange={handleInputChange}
                      className="select-field"
                    >
                      {jobTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="salary" className="block text-sm font-medium mb-2">
                      Salary <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="salary"
                      name="salary"
                      value={jobData.salary}
                      onChange={handleInputChange}
                      placeholder="e.g. $120,000 - $150,000 or $75 per hour"
                      className={`input-field ${errors.salary ? 'border-red-500 dark:border-red-500' : ''}`}
                    />
                    {errors.salary && <p className="text-red-500 text-sm mt-1">{errors.salary}</p>}
                  </div>

                  <div>
                    <label htmlFor="industry" className="block text-sm font-medium mb-2">
                      Industry
                    </label>
                    <select
                      id="industry"
                      name="industry"
                      value={jobData.industry}
                      onChange={handleInputChange}
                      className="select-field"
                    >
                      {industries.map(industry => (
                        <option key={industry} value={industry}>{industry}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium mb-2">
                    Job Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={jobData.description}
                    onChange={handleInputChange}
                    rows={6}
                    placeholder="Describe the job role, including key responsibilities and objectives"
                    className={`input-field resize-none ${errors.description ? 'border-red-500 dark:border-red-500' : ''}`}
                  />
                  {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </div>

                <div>
                  <label htmlFor="requirements" className="block text-sm font-medium mb-2">
                    General Requirements <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="requirements"
                    name="requirements"
                    value={jobData.requirements}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Overview of experience and skills required"
                    className={`input-field resize-none ${errors.requirements ? 'border-red-500 dark:border-red-500' : ''}`}
                  />
                  {errors.requirements && <p className="text-red-500 text-sm mt-1">{errors.requirements}</p>}
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="btn btn-primary flex items-center"
                  >
                    Next Step
                    <ArrowRightIcon className="h-4 w-4 ml-2" />
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                {/* Step 2: Detailed Information - Same as PostJob.jsx */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium">
                      Key Responsibilities <span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => addArrayItem('responsibilities')}
                      className="text-primary hover:text-primary-dark flex items-center text-sm font-medium"
                    >
                      <PlusIcon className="h-4 w-4 mr-1" />
                      Add Responsibility
                    </button>
                  </div>
                  {errors.responsibilities && <p className="text-red-500 text-sm mb-2">{errors.responsibilities}</p>}
                  {jobData.responsibilities.map((item, index) => (
                    <div key={index} className="flex items-center mb-3">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => handleArrayInputChange(index, 'responsibilities', e.target.value)}
                        placeholder={`Responsibility ${index + 1}`}
                        className="input-field flex-grow"
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayItem('responsibilities', index)}
                        className="ml-2 p-2 text-surface-500 hover:text-red-500"
                        aria-label="Remove responsibility"
                      >
                        <MinusIcon className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium">
                      Qualifications <span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => addArrayItem('qualifications')}
                      className="text-primary hover:text-primary-dark flex items-center text-sm font-medium"
                    >
                      <PlusIcon className="h-4 w-4 mr-1" />
                      Add Qualification
                    </button>
                  </div>
                  {errors.qualifications && <p className="text-red-500 text-sm mb-2">{errors.qualifications}</p>}
                  {jobData.qualifications.map((item, index) => (
                    <div key={index} className="flex items-center mb-3">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => handleArrayInputChange(index, 'qualifications', e.target.value)}
                        placeholder={`Qualification ${index + 1}`}
                        className="input-field flex-grow"
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayItem('qualifications', index)}
                        className="ml-2 p-2 text-surface-500 hover:text-red-500"
                        aria-label="Remove qualification"
                      >
                        <MinusIcon className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="applicationEmail" className="block text-sm font-medium mb-2">
                      Application Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="applicationEmail"
                      name="applicationEmail"
                      value={jobData.applicationEmail}
                      onChange={handleInputChange}
                      placeholder="Email for receiving applications"
                      className={`input-field ${errors.applicationEmail ? 'border-red-500 dark:border-red-500' : ''}`}
                    />
                    {errors.applicationEmail && <p className="text-red-500 text-sm mt-1">{errors.applicationEmail}</p>}
                    <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
                      Either email or URL is required for applications
                    </p>
                  </div>

                  <div>
                    <label htmlFor="applicationUrl" className="block text-sm font-medium mb-2">
                      Application URL <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="url"
                      id="applicationUrl"
                      name="applicationUrl"
                      value={jobData.applicationUrl}
                      onChange={handleInputChange}
                      placeholder="https://your-careers-page.com/apply"
                      className={`input-field ${errors.applicationUrl ? 'border-red-500 dark:border-red-500' : ''}`}
                    />
                    {errors.applicationUrl && <p className="text-red-500 text-sm mt-1">{errors.applicationUrl}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="expiryDate" className="block text-sm font-medium mb-2">
                    Expiry Date (Optional)
                  </label>
                  <input
                    type="date"
                    id="expiryDate"
                    name="expiryDate"
                    value={jobData.expiryDate}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="input-field"
                  />
                  <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
                    If left blank, the job posting will remain active until manually deactivated
                  </p>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="btn btn-outline flex items-center"
                  >
                    <ArrowLeftIcon className="h-4 w-4 mr-2" />
                    Previous Step
                  </button>
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={togglePreview}
                      className="btn btn-primary flex items-center"
                    >
                      <EyeIcon className="h-4 w-4 mr-2" />
                      Preview Changes
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn btn-secondary flex items-center"
                    >
                      {isSubmitting ? "Saving..." : (
                        <>
                          <SaveIcon className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

export default EditJob;