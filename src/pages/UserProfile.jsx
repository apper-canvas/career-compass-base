import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';

// Mock data for user
const mockUser = {
  id: 1,
  name: "Jane Smith",
  email: "jane.smith@example.com",
  phone: "(555) 123-4567",
  location: "San Francisco, CA",
  avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  hasDefaultResume: true,
  defaultResumeId: 2,
  skills: ["React", "JavaScript", "TypeScript", "UI/UX Design", "Node.js"],
  preferences: {
    jobTypes: ["Full-time", "Remote"],
    industries: ["Technology", "Design"],
    locations: ["San Francisco, CA", "Remote"]
  }
};

// Mock data for job alerts
const mockJobAlerts = [
  {
    id: 1,
    name: "Senior Frontend Developer",
    criteria: {
      title: "Frontend Developer",
      location: "San Francisco, CA",
      industry: "Technology",
      minSalary: 100000,
      maxSalary: 150000
    },
    frequency: "daily",
    active: true,
    createdAt: "2023-04-15T10:30:00Z"
  },
  {
    id: 2,
    name: "Remote UX Design",
    criteria: {
      title: "UX Designer",
      location: "Remote",
      industry: "Design",
      minSalary: 80000,
      maxSalary: 120000
    },
    frequency: "weekly",
    active: true,
    createdAt: "2023-05-22T14:15:00Z"
  }
];

// Mock data for resumes
const mockResumes = [
  {
    id: 1,
    name: "Software Developer Resume",
    fileName: "jane_smith_software_developer.pdf",
    fileSize: 1240000,
    fileType: "application/pdf",
    uploadDate: "2023-03-10T15:30:00Z",
    isDefault: false,
    version: 1
  },
  {
    id: 2,
    name: "UX Designer Resume",
    fileName: "jane_smith_ux_designer.pdf",
    fileSize: 980000,
    fileType: "application/pdf",
    uploadDate: "2023-05-22T09:15:00Z",
    isDefault: true,
    version: 3
  },
  {
    id: 3,
    name: "Product Manager Resume",
    fileName: "jane_smith_product_manager.docx",
    fileSize: 1450000,
    fileType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    uploadDate: "2023-08-05T12:45:00Z",
    isDefault: false,
    version: 1
  }
];

// Reusable Tab Component
const Tab = ({ title, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 font-medium text-sm transition-colors duration-200 ${
        active 
          ? "text-primary border-b-2 border-primary"
          : "text-surface-600 dark:text-surface-400 hover:text-primary"
      }`}
    >
      {title}
    </button>
  );
};

// Job Alerts Component
const JobAlerts = ({ alerts, setAlerts }) => {
  const [showAddAlert, setShowAddAlert] = useState(false);
  const [showEditAlert, setShowEditAlert] = useState(false);
  const [currentAlert, setCurrentAlert] = useState(null);
  const [newAlert, setNewAlert] = useState({
    name: "",
    criteria: {
      title: "",
      location: "",
      industry: "",
      minSalary: "",
      maxSalary: ""
    },
    frequency: "daily",
    active: true
  });

  const BellIcon = getIcon('bell');
  const BellRingIcon = getIcon('bell-ring');
  const TrashIcon = getIcon('trash');
  const EditIcon = getIcon('edit');
  const PlusIcon = getIcon('plus');
  const AlertTriangleIcon = getIcon('alert-triangle');

  const industries = ["Technology", "Design", "Marketing", "Data Science", "Finance", "Healthcare", "Education"];
  const frequencies = [
    { value: "immediate", label: "Immediate" },
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" }
  ];
  const locations = ["San Francisco, CA", "New York, NY", "Chicago, IL", "Boston, MA", "Remote", "Austin, TX", "Seattle, WA"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setNewAlert(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setNewAlert(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const validateAlert = () => {
    if (!newAlert.name) {
      toast.error("Please provide a name for this alert");
      return false;
    }
    if (!newAlert.criteria.title && !newAlert.criteria.industry && !newAlert.criteria.location) {
      toast.error("Please specify at least one job criteria");
      return false;
    }
    return true;
  };

  const handleAddAlert = () => {
    if (!validateAlert()) return;
    
    const alert = {
      ...newAlert,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    
    setAlerts([...alerts, alert]);
    setNewAlert({
      name: "",
      criteria: {
        title: "",
        location: "",
        industry: "",
        minSalary: "",
        maxSalary: ""
      },
      frequency: "daily",
      active: true
    });
    setShowAddAlert(false);
    toast.success("Job alert created successfully!");
  };

  const handleEditClick = (alert) => {
    setCurrentAlert(alert);
    setNewAlert(alert);
    setShowEditAlert(true);
  };

  const handleUpdateAlert = () => {
    if (!validateAlert()) return;
    
    const updatedAlerts = alerts.map(alert => 
      alert.id === currentAlert.id ? newAlert : alert
    );
    
    setAlerts(updatedAlerts);
    setShowEditAlert(false);
    toast.success("Job alert updated successfully!");
  };

  const handleDeleteAlert = (id) => {
    if (window.confirm("Are you sure you want to delete this job alert?")) {
      const updatedAlerts = alerts.filter(alert => alert.id !== id);
      setAlerts(updatedAlerts);
      toast.success("Job alert deleted successfully!");
    }
  };

  const handleToggleActive = (id) => {
    const updatedAlerts = alerts.map(alert => 
      alert.id === id ? { ...alert, active: !alert.active } : alert
    );
    setAlerts(updatedAlerts);
    
    const alert = alerts.find(a => a.id === id);
    const newStatus = !alert.active;
    toast.success(`Job alert ${newStatus ? 'activated' : 'deactivated'} successfully!`);
  };

  const AlertForm = ({ onSubmit, buttonText }) => (
    <div className="bg-white dark:bg-surface-800 rounded-xl shadow-card p-5 mt-5">
      <h3 className="text-lg font-semibold mb-4">{buttonText === "Add Alert" ? "Create New Job Alert" : "Edit Job Alert"}</h3>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Alert Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="E.g., Frontend Developer in San Francisco"
            className="input-field"
            value={newAlert.name}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div>
          <label htmlFor="criteria.title" className="block text-sm font-medium mb-1">
            Job Title
          </label>
          <input
            type="text"
            id="criteria.title"
            name="criteria.title"
            placeholder="E.g., Frontend Developer"
            className="input-field"
            value={newAlert.criteria.title}
            onChange={handleInputChange}
          />
        </div>
        
        <div>
          <label htmlFor="criteria.location" className="block text-sm font-medium mb-1">
            Location
          </label>
          <select
            id="criteria.location"
            name="criteria.location"
            className="select-field"
            value={newAlert.criteria.location}
            onChange={handleInputChange}
          >
            <option value="">Any Location</option>
            {locations.map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="criteria.industry" className="block text-sm font-medium mb-1">
            Industry
          </label>
          <select
            id="criteria.industry"
            name="criteria.industry"
            className="select-field"
            value={newAlert.criteria.industry}
            onChange={handleInputChange}
          >
            <option value="">Any Industry</option>
            {industries.map(industry => (
              <option key={industry} value={industry}>{industry}</option>
            ))}
          </select>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="criteria.minSalary" className="block text-sm font-medium mb-1">
              Min Salary
            </label>
            <input
              type="number"
              id="criteria.minSalary"
              name="criteria.minSalary"
              placeholder="E.g., 80000"
              className="input-field"
              value={newAlert.criteria.minSalary}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="criteria.maxSalary" className="block text-sm font-medium mb-1">
              Max Salary
            </label>
            <input
              type="number"
              id="criteria.maxSalary"
              name="criteria.maxSalary"
              placeholder="E.g., 120000"
              className="input-field"
              value={newAlert.criteria.maxSalary}
              onChange={handleInputChange}
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="frequency" className="block text-sm font-medium mb-1">
            Alert Frequency
          </label>
          <select
            id="frequency"
            name="frequency"
            className="select-field"
            value={newAlert.frequency}
            onChange={handleInputChange}
          >
            {frequencies.map(freq => (
              <option key={freq.value} value={freq.value}>{freq.label}</option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center pt-3">
          <button
            type="button"
            onClick={onSubmit}
            className="btn btn-primary w-full"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-semibold">Job Alerts</h2>
        <button
          onClick={() => setShowAddAlert(!showAddAlert)}
          className="btn btn-primary flex items-center"
        >
          <PlusIcon className="h-4 w-4 mr-1" />
          Add Alert
        </button>
      </div>
      
      <p className="text-surface-600 dark:text-surface-400 mb-6">
        Set up personalized job alerts to get notified when new jobs matching your criteria are posted.
      </p>
      
      {showAddAlert && <AlertForm onSubmit={handleAddAlert} buttonText="Add Alert" />}
      
      {showEditAlert && <AlertForm onSubmit={handleUpdateAlert} buttonText="Update Alert" />}
      
      {alerts.length === 0 ? (
        <div className="bg-white dark:bg-surface-800 rounded-xl shadow-card p-8 text-center">
          <AlertTriangleIcon className="mx-auto h-12 w-12 text-surface-400 mb-3" />
          <h3 className="text-lg font-semibold mb-2">No Job Alerts Set Up</h3>
          <p className="text-surface-600 dark:text-surface-400 mb-4">
            You haven't created any job alerts yet. Create an alert to get notified about new jobs matching your criteria.
          </p>
          <button
            onClick={() => setShowAddAlert(true)}
            className="btn btn-primary"
          >
            Create Your First Alert
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map(alert => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-surface-800 rounded-xl shadow-card p-5 border border-surface-200 dark:border-surface-700"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-full ${alert.active ? 'bg-green-100 text-green-600' : 'bg-surface-200 text-surface-500 dark:bg-surface-700 dark:text-surface-400'}`}>
                    {alert.active ? <BellRingIcon className="h-5 w-5" /> : <BellIcon className="h-5 w-5" />}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">{alert.name}</h3>
                    <p className="text-sm text-surface-500 dark:text-surface-400">
                      {alert.frequency === 'immediate' ? 'Immediate alerts' : 
                       alert.frequency === 'daily' ? 'Daily alerts' : 'Weekly alerts'}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleToggleActive(alert.id)}
                    className={`p-1.5 rounded-full ${
                      alert.active 
                        ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                        : 'bg-surface-200 text-surface-500 hover:bg-surface-300 dark:bg-surface-700 dark:text-surface-400 dark:hover:bg-surface-600'
                    }`}
                    aria-label={alert.active ? "Deactivate alert" : "Activate alert"}
                  >
                    {alert.active ? <BellRingIcon className="h-4 w-4" /> : <BellIcon className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => handleEditClick(alert)}
                    className="p-1.5 rounded-full bg-surface-200 text-surface-500 hover:bg-surface-300 dark:bg-surface-700 dark:text-surface-400 dark:hover:bg-surface-600"
                    aria-label="Edit alert"
                  >
                    <EditIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteAlert(alert.id)}
                    className="p-1.5 rounded-full bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                    aria-label="Delete alert"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                {alert.criteria.title && (
                  <div className="flex items-center">
                    <span className="font-medium mr-2">Job Title:</span>
                    <span className="text-surface-700 dark:text-surface-300">{alert.criteria.title}</span>
                  </div>
                )}
                {alert.criteria.location && (
                  <div className="flex items-center">
                    <span className="font-medium mr-2">Location:</span>
                    <span className="text-surface-700 dark:text-surface-300">{alert.criteria.location}</span>
                  </div>
                )}
                {alert.criteria.industry && (
                  <div className="flex items-center">
                    <span className="font-medium mr-2">Industry:</span>
                    <span className="text-surface-700 dark:text-surface-300">{alert.criteria.industry}</span>
                  </div>
                )}
                {(alert.criteria.minSalary || alert.criteria.maxSalary) && (
                  <div className="flex items-center">
                    <span className="font-medium mr-2">Salary Range:</span>
                    <span className="text-surface-700 dark:text-surface-300">
                      {alert.criteria.minSalary ? `$${Number(alert.criteria.minSalary).toLocaleString()}` : '$0'}
                      {' - '}
                      {alert.criteria.maxSalary ? `$${Number(alert.criteria.maxSalary).toLocaleString()}` : 'Any'}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

// Resume Component
const Resume = () => {
  const [resumes, setResumes] = useState(mockResumes);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [previewResume, setPreviewResume] = useState(null);
  const fileInputRef = useRef(null);

  // Icons
  const FileTextIcon = getIcon('file-text');
  const UploadIcon = getIcon('upload');
  const DownloadIcon = getIcon('download');
  const TrashIcon = getIcon('trash');
  const StarIcon = getIcon('star');
  const CheckIcon = getIcon('check');
  const XIcon = getIcon('x');
  const AlertTriangleIcon = getIcon('alert-triangle');
  const FileIcon = getIcon('file');
  const FileTypeIcon = getIcon('file');
  const EyeIcon = getIcon('eye');

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Handle drag events
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length) {
      handleFileUpload(files[0]);
    }
  };

  // Validate file
  const validateFile = (file) => {
    // Accepted file types
    const acceptedTypes = [
      'application/pdf', 
      'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    // Check file type
    if (!acceptedTypes.includes(file.type)) {
      toast.error('Please upload a PDF or Word document');
      return false;
    }
    
    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size should not exceed 5MB');
      return false;
    }
    
    return true;
  };

  // Handle file upload
  const handleFileUpload = (file) => {
    if (!validateFile(file)) return;
    
    // Simulate upload progress
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            addNewResume(file);
            setIsUploading(false);
          }, 500);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  // Add new resume to the list
  const addNewResume = (file) => {
    // Generate a new ID (would normally be handled by backend)
    const newId = Math.max(...resumes.map(r => r.id)) + 1;
    
    // Check if this is the first resume (set as default)
    const isDefault = resumes.length === 0;
    
    // Find if there are existing resumes with similar names to determine version
    const baseName = file.name.split('.')[0]; // Name without extension
    const existingVersions = resumes.filter(r => 
      r.fileName.split('.')[0].toLowerCase() === baseName.toLowerCase()
    );
    const version = existingVersions.length + 1;
    
    // Create new resume object
    const newResume = {
      id: newId,
      name: baseName,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      uploadDate: new Date().toISOString(),
      isDefault: isDefault,
      version: version
    };
    
    // Add to resumes list
    setResumes([newResume, ...resumes]);
    toast.success(`Resume "${baseName}" uploaded successfully`);
  };

  // Set default resume
  const setDefaultResume = (id) => {
    const updatedResumes = resumes.map(resume => ({
      ...resume,
      isDefault: resume.id === id
    }));
    
    setResumes(updatedResumes);
    toast.success('Default resume set successfully');
  };

  // Delete resume
  const deleteResume = (id) => {
    // Check if it's the default resume
    const isDefault = resumes.find(r => r.id === id)?.isDefault;
    
    if (isDefault) {
      toast.error('Cannot delete default resume. Please set another resume as default first.');
      return;
    }
    
    // Confirm delete
    if (window.confirm('Are you sure you want to delete this resume? This action cannot be undone.')) {
      const updatedResumes = resumes.filter(resume => resume.id !== id);
      setResumes(updatedResumes);
      
      // Close preview if the deleted resume was being previewed
      if (previewResume && previewResume.id === id) {
        setPreviewResume(null);
      }
      
      toast.success('Resume deleted successfully');
    }
  };

  // Simulate resume download
  const downloadResume = (resume) => {
    toast.info(`Downloading ${resume.fileName}...`);
    // In a real app, this would trigger an actual file download
    setTimeout(() => {
      toast.success(`${resume.fileName} downloaded successfully`);
    }, 1500);
  };

  // Open file dialog
  const handleFileButtonClick = () => {
    fileInputRef.current.click();
  };

  // Show resume preview
  const showPreview = (resume) => {
    setPreviewResume(resume);
  };

  // Get file icon based on file type
  const getFileTypeIcon = (fileType) => {
    if (fileType === 'application/pdf') {
      return 'file-text';
    } else if (fileType.includes('word')) {
      return 'file-text';
    } else {
      return 'file';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-semibold">Resume Management</h2>
        <button
          onClick={handleFileButtonClick}
          className="btn btn-primary flex items-center"
        >
          <UploadIcon className="h-4 w-4 mr-1" />
          Upload Resume
        </button>
      </div>

      <p className="text-surface-600 dark:text-surface-400 mb-6">
        Upload and manage your resumes. You can set a default resume that will be used for job applications.
      </p>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => e.target.files[0] && handleFileUpload(e.target.files[0])}
        className="hidden"
        accept=".pdf,.doc,.docx"
      />

      {/* Drag and drop area */}
      <div
        className={`border-2 border-dashed rounded-xl p-8 mb-8 text-center transition-colors ${
          isDragging 
            ? 'border-primary bg-primary/5' 
            : 'border-surface-300 dark:border-surface-700 hover:border-primary'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <UploadIcon className="h-10 w-10 mx-auto mb-3 text-surface-500 dark:text-surface-400" />
        <h3 className="text-lg font-medium mb-2">Drag & Drop Your Resume</h3>
        <p className="text-surface-600 dark:text-surface-400 mb-3">
          Supports PDF, DOC, and DOCX files up to 5MB
        </p>
        <button 
          onClick={handleFileButtonClick}
          className="btn btn-outline mt-2"
        >
          Select File
        </button>

        {/* Upload progress */}
        {isUploading && (
          <div className="mt-4">
            <div className="h-2 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-surface-600 dark:text-surface-400 mt-2">
              Uploading... {uploadProgress}%
            </p>
          </div>
        )}
      </div>

      {/* Resume preview modal */}
      {previewResume && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-surface-800 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-surface-200 dark:border-surface-700">
              <h3 className="text-lg font-semibold">{previewResume.name}</h3>
              <button 
                onClick={() => setPreviewResume(null)}
                className="p-1 rounded-full hover:bg-surface-200 dark:hover:bg-surface-700"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-4 h-[60vh] flex flex-col items-center justify-center bg-surface-100 dark:bg-surface-900">
              {/* In a real app, this would be an actual document preview */}
              <FileIcon className="h-16 w-16 text-surface-500 mb-4" />
              <p className="text-lg font-medium mb-2">{previewResume.fileName}</p>
              <p className="text-surface-600 dark:text-surface-400 mb-4">
                {previewResume.fileType === 'application/pdf' ? 'PDF Document' : 'Word Document'} - {formatFileSize(previewResume.fileSize)}
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => downloadResume(previewResume)} 
                  className="btn btn-primary flex items-center"
                >
                  <DownloadIcon className="h-4 w-4 mr-1" />
                  Download
                </button>
                {!previewResume.isDefault && (
                  <button 
                    onClick={() => { setDefaultResume(previewResume.id); setPreviewResume({...previewResume, isDefault: true}); }}
                    className="btn btn-outline flex items-center"
                  >
                    <StarIcon className="h-4 w-4 mr-1" />
                    Set as Default
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Resume list */}
      {resumes.length === 0 ? (
        <div className="bg-white dark:bg-surface-800 rounded-xl shadow-card p-8 text-center">
          <AlertTriangleIcon className="mx-auto h-12 w-12 text-surface-400 mb-3" />
          <h3 className="text-lg font-semibold mb-2">No Resumes Uploaded</h3>
          <p className="text-surface-600 dark:text-surface-400 mb-4">
            You haven't uploaded any resumes yet. Upload a resume to apply for jobs more efficiently.
          </p>
          <button
            onClick={handleFileButtonClick}
            className="btn btn-primary"
          >
            Upload Your First Resume
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {resumes.map(resume => (
            <motion.div
              key={resume.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-surface-800 rounded-xl shadow-card p-5 border border-surface-200 dark:border-surface-700"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-full ${
                    resume.isDefault 
                      ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' 
                      : 'bg-surface-200 text-surface-500 dark:bg-surface-700 dark:text-surface-400'
                  }`}>
                    {getIcon(getFileTypeIcon(resume.fileType))({ className: "h-5 w-5" })}
                  </div>
                  <div>
                    <div className="flex items-center">
                      <h3 className="text-lg font-medium">{resume.name}</h3>
                      {resume.version > 1 && (
                        <span className="ml-2 text-xs bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-300 px-2 py-0.5 rounded-full">
                          v{resume.version}
                        </span>
                      )}
                      {resume.isDefault && (
                        <span className="ml-2 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full flex items-center">
                          <CheckIcon className="h-3 w-3 mr-0.5" />
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-surface-500 dark:text-surface-400">
                      Uploaded on {formatDate(resume.uploadDate)}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => showPreview(resume)}
                    className="p-1.5 rounded-full bg-surface-200 text-surface-500 hover:bg-surface-300 dark:bg-surface-700 dark:text-surface-400 dark:hover:bg-surface-600"
                    aria-label="Preview resume"
                  >
                    <EyeIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => downloadResume(resume)}
                    className="p-1.5 rounded-full bg-surface-200 text-surface-500 hover:bg-surface-300 dark:bg-surface-700 dark:text-surface-400 dark:hover:bg-surface-600"
                    aria-label="Download resume"
                  >
                    <DownloadIcon className="h-4 w-4" />
                  </button>
                  {!resume.isDefault && (
                    <button
                      onClick={() => setDefaultResume(resume.id)}
                      className="p-1.5 rounded-full bg-surface-200 text-surface-500 hover:bg-surface-300 dark:bg-surface-700 dark:text-surface-400 dark:hover:bg-surface-600"
                      aria-label="Set as default resume"
                    >
                      <StarIcon className="h-4 w-4" />
                    </button>
                  )}
                  {!resume.isDefault && (
                    <button
                      onClick={() => deleteResume(resume.id)}
                      className="p-1.5 rounded-full bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                      aria-label="Delete resume"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
              
              <div className="mt-3 text-sm text-surface-600 dark:text-surface-400 flex items-center">
                <span className="mr-3">{resume.fileType === 'application/pdf' ? 'PDF Document' : 'Word Document'}</span>
                <span>{formatFileSize(resume.fileSize)}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

// Main User Profile Component
const UserProfile = () => {
  const [activeTab, setActiveTab] = useState("job-alerts");
  const [jobAlerts, setJobAlerts] = useState(mockJobAlerts);
  
  const UserIcon = getIcon('user');
  const BellIcon = getIcon('bell');
  const FileTextIcon = getIcon('file-text');
  const SettingsIcon = getIcon('settings');
  
  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* User Profile Sidebar */}
        <div className="lg:col-span-1">
          <div className="card mb-6">
            <div className="flex flex-col items-center text-center">
              <img 
                src={mockUser.avatar} 
                alt={mockUser.name} 
                className="w-24 h-24 rounded-full object-cover mb-4"
              />
              <h2 className="text-xl font-semibold">{mockUser.name}</h2>
              <p className="text-surface-600 dark:text-surface-400 mb-2">{mockUser.location}</p>
              <p className="text-sm text-surface-500 dark:text-surface-500">{mockUser.email}</p>
            </div>
          </div>
          
          <div className="bg-white dark:bg-surface-800 rounded-xl shadow-card overflow-hidden">
            <div className="divide-y divide-surface-200 dark:divide-surface-700">
              <button 
                onClick={() => setActiveTab("profile")}
                className={`flex items-center w-full px-4 py-3 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors ${activeTab === "profile" ? "bg-surface-100 dark:bg-surface-700" : ""}`}
              >
                <UserIcon className="h-5 w-5 mr-3 text-primary" />
                <span>Personal Information</span>
              </button>
              
              <button 
                onClick={() => setActiveTab("job-alerts")}
                className={`flex items-center w-full px-4 py-3 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors ${activeTab === "job-alerts" ? "bg-surface-100 dark:bg-surface-700" : ""}`}
              >
                <BellIcon className="h-5 w-5 mr-3 text-primary" />
                <span>Job Alerts</span>
              </button>
              
              <button 
                onClick={() => setActiveTab("resume")}
                className={`flex items-center w-full px-4 py-3 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors ${activeTab === "resume" ? "bg-surface-100 dark:bg-surface-700" : ""}`}
              >
                <FileTextIcon className="h-5 w-5 mr-3 text-primary" />
                <span>Resume</span>
              </button>
              
              <button 
                onClick={() => setActiveTab("settings")}
                className={`flex items-center w-full px-4 py-3 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors ${activeTab === "settings" ? "bg-surface-100 dark:bg-surface-700" : ""}`}
              >
                <SettingsIcon className="h-5 w-5 mr-3 text-primary" />
                <span>Settings</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Main Content Area */}
        <div className="lg:col-span-3">
          <div className="card">
            <div className="border-b border-surface-200 dark:border-surface-700 mb-6">
              <div className="flex space-x-2">
                <Tab 
                  title="Personal Information" 
                  active={activeTab === "profile"} 
                  onClick={() => setActiveTab("profile")}
                />
                <Tab 
                  title="Job Alerts" 
                  active={activeTab === "job-alerts"} 
                  onClick={() => setActiveTab("job-alerts")}
                />
                <Tab 
                  title="Resume" 
                  active={activeTab === "resume"} 
                  onClick={() => setActiveTab("resume")}
                />
                <Tab 
                  title="Settings" 
                  active={activeTab === "settings"} 
                  onClick={() => setActiveTab("settings")}
                />
              </div>
            </div>
            
            {activeTab === "job-alerts" && (
              <JobAlerts alerts={jobAlerts} setAlerts={setJobAlerts} />
            )}
            
            {activeTab === "profile" && (
              <div>
                <h2 className="text-2xl font-semibold mb-5">Personal Information</h2>
                <p className="text-surface-600 dark:text-surface-400 mb-8">
                  Manage your personal information and contact details.
                </p>
                <div className="space-y-6">
                  {/* Profile form would go here */}
                  <p className="text-center text-surface-500 italic py-8">
                    Profile management features coming soon...
                  </p>
                </div>
              </div>
            )}
            
            {activeTab === "resume" && <Resume />}
            
            {/* Settings Tab */}
                </div>
              </div>
            )}
            
            {activeTab === "settings" && (
              <div>
                <h2 className="text-2xl font-semibold mb-5">Settings</h2>
                <p className="text-surface-600 dark:text-surface-400 mb-8">
                  Manage your account settings and preferences.
                </p>
                <div className="space-y-6">
                  {/* Settings form would go here */}
                  <p className="text-center text-surface-500 italic py-8">
                    Settings features coming soon...
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;