import { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { getAllJobs, getJobsByEmployer, getJobById, createJob, updateJob, deleteJob, toggleJobStatus } from '../services/jobService';
import { getUserApplications, getJobApplications, applyForJob, updateApplicationStatus } from '../services/applicationService';
import { getCandidateInterviews, getEmployerInterviews, scheduleInterview } from '../services/interviewService';
import { getAllDeadlineNotifications, createDeadlineNotification } from '../services/deadlineNotificationService';

import { 
  sendJobApplicationConfirmation, 
  sendApplicationStatusUpdate, 
  sendInterviewInvitation, 
  sendJobDeadlineReminder 
} from '../services/EmailNotificationService';

// Create the Job context
const JobContext = createContext();

// Custom hook to use the job context
export const useJob = () => {
  return useContext(JobContext);
};

export const JobProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [deadlineNotifications, setDeadlineNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [interviews, setInterviews] = useState([]);
  const { user: currentUser } = useSelector((state) => state.user);
  // Initial data loading
  // Initialize jobs from localStorage on mount
  useEffect(() => {
    fetchJobs();
    setLoading(false);
  }, []);
  // Load user applications when user changes
  useEffect(() => {
      if (currentUser) {
        fetchUserData();
        localStorage.setItem('deadlineNotifications', JSON.stringify(deadlineNotifications));
      }
  }, [deadlineNotifications, loading]);
  
  // Fetch all jobs from the database
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const jobData = await getAllJobs();
      setJobs(jobData);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error("Could not load jobs");
    } finally {
      const intervalId = setInterval(checkDeadlines, 3600000); // Check deadlines every hour
      setLoading(false);
      return () => clearInterval(intervalId); 
    }
  };
  // Fetch user-specific data
  const fetchUserData = async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      
      // Fetch applications for the current user
      if (currentUser.role === 'candidate') {
        const userApps = await getUserApplications(currentUser.Id);
        setApplications(userApps);
        
        // Fetch interviews for candidate
        const userInterviews = await getCandidateInterviews(currentUser.Id);
        setInterviews(userInterviews);
      } 
      else if (currentUser.role === 'employer') {
        // Fetch employer's jobs
        const employerJobs = await getJobsByEmployer(currentUser.Id);
        setJobs(employerJobs);
        
        // Fetch interviews for employer
        const employerInterviews = await getEmployerInterviews(currentUser.Id);
        setInterviews(employerInterviews);
      }
      
      // Fetch deadline notifications
      const notifications = await getAllDeadlineNotifications();
      setDeadlineNotifications(notifications);
      
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Could not load your data");
    } finally {
      setLoading(false);
     }
    }

  const getAllJobsService = async (options = {}) => {
    try {
      setLoading(true);
      const jobData = await getAllJobs(options);
      setJobs(jobData);
      return jobData;
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error("Could not load jobs");
      return [];
    } finally {
      setLoading(false);
    }
  };
  // Get jobs by employer
  const getJobsByEmployerService = async (employerId) => {
    try {
      setLoading(true);
      const jobData = await getJobsByEmployer(employerId);
      return jobData;
    } catch (error) {
      console.error("Error fetching employer jobs:", error);
      toast.error("Could not load your jobs");
      return [];
    } finally {
      setLoading(false);
    }
  };
  // Get job by ID
  const getJobByIdService = async (jobId) => {
    try {
      setLoading(true);
      const job = await getJobById(jobId);
      return job;
    } catch (error) {
      console.error("Error fetching job:", error);
      toast.error("Could not load job details");
      return null;
    } finally {
      setLoading(false);
    }
  };
  // Create job
  const createJobService = async (jobData) => {
    try {
      if (!currentUser || currentUser.role !== 'employer') {
        throw new Error('Only employers can post jobs');
      }
      
      if (currentUser.role !== 'employer') {
        throw new Error('Only employers can post jobs');
      }
      
      setLoading(true);
      // Prepare job data with employer info
      const completeJobData = {
        ...jobData,
        employerId: currentUser.Id,
        employerName: currentUser.companyName || `${currentUser.firstName} ${currentUser.lastName}'s Company`
      };
            // Create job in database
      const newJob = await createJob(completeJobData);
      
      // Update local state
      setJobs(prevJobs => {
        const updatedJobs = [...prevJobs];
        updatedJobs.push(newJob);
        return updatedJobs;
      });
      
      toast.success('Job posted successfully!');
      return newJob;
    } catch (error) {
      toast.error(error.message || 'Failed to post job');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update job
  const updateJobService = async (jobId, jobData) => {
    try {
      if (!currentUser || currentUser.role !== 'employer') {
        throw new Error('Only employers can update jobs');
      }
      setLoading(true);
      
      // Get job to verify ownership
      const existingJob = await getJobById(jobId);
      
      if (!existingJob) {
        throw new Error('Job not found');
      }
      
      // Check if user owns this job
      if (existingJob.employerId !== currentUser.Id) {
        throw new Error('You can only edit your own job listings');
      }
      
      // Update job in database
      const updatedJob = await updateJob(jobId, jobData);
      
      // Update local state
      setJobs(prevJobs => {
        const updatedJobs = [...prevJobs];
        const jobIndex = updatedJobs.findIndex(job => job.Id === jobId);
        if (jobIndex !== -1) {
          updatedJobs[jobIndex] = updatedJob;
        }
        return updatedJobs;
      });
      
      toast.success('Job updated successfully!');
      return updatedJob;
    } catch (error) {
      toast.error(error.message || 'Failed to update job');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Delete job (soft delete)
  const deleteJobService = async (jobId) => {
    try {
      if (!currentUser || currentUser.role !== 'employer') {
        throw new Error('Only employers can delete jobs');
      }
      setLoading(true);
      
      // Get job to verify ownership
      const existingJob = await getJobById(jobId);
      
      if (!existingJob) {
        throw new Error('Job not found');
      }
      
      // Check if user owns this job
      if (existingJob.employerId !== currentUser.Id) {
        throw new Error('You can only delete your own job listings');
      }
      
      // Delete job in database (soft delete)
      await deleteJob(jobId);
      
      // Update local state
      setJobs(prevJobs => {
        return prevJobs.filter(job => job.Id !== jobId);
      });
      
      // Send emails to applicants about job deletion
      try {
        // Get all applications for this job
        const jobApplications = await getJobApplications(jobId);
        
        // Send status update emails
        for (const application of jobApplications) {
          await sendApplicationStatusUpdate(application.userId, 'job_closed', application);
        }
      } catch (emailError) {
        console.error("Error sending notification emails:", emailError);
      }
      
      toast.success('Job deleted successfully!');
      return true;
    } catch (error) {
      toast.error(error.message || 'Failed to delete job');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Toggle job status (active/inactive)
  const toggleJobStatusService = async (jobId) => {
    try {
      if (!currentUser || currentUser.role !== 'employer') {
        throw new Error('Only employers can update job status');
      }
      
      // Get job to verify ownership and current status
      const existingJob = await getJobById(jobId);
      
      if (!existingJob) {
        throw new Error('Job not found');
      }
      
      // Check if user owns this job
      if (existingJob.employerId !== currentUser.Id) {
        throw new Error('You can only update your own job listings');
      }
      
      // Toggle status in database
      const updatedJob = await toggleJobStatus(jobId, existingJob.status);
      
      // Update local state
      setJobs(prevJobs => {
        const updatedJobs = [...prevJobs];
        const jobIndex = updatedJobs.findIndex(job => job.Id === jobId);
        if (jobIndex !== -1) {
          updatedJobs[jobIndex] = updatedJob;
        }
        return updatedJobs;
      });
      
      toast.success(`Job ${updatedJob.status === 'active' ? 'activated' : 'deactivated'} successfully!`);
      return updatedJob;
    } catch (error) {
      toast.error(error.message || 'Failed to update job status');
      throw error;
    }
  };

  // Apply for job
  const applyForJobService = async (jobId, applicationData) => {
    try {
      if (!currentUser) {
        throw new Error('You must be logged in to apply for jobs');
      }
      
      if (currentUser.role !== 'candidate') {
        throw new Error('Only candidates can apply for jobs');
      }
      
      setLoading(true);
      
      // Get job details
      const job = await getJobById(jobId);
      
      if (!job) {
        throw new Error('Job not found');
      }
      
      // Check if user has already applied
      const userApplications = await getUserApplications(currentUser.Id);
      const existingApplication = userApplications.find(app => app.jobId === jobId);
      
      if (existingApplication) {
        throw new Error('You have already applied for this job');
      }
      
      // Prepare application data
      const completeApplicationData = {
        ...applicationData,
        jobId,
        userId: currentUser.Id,
        jobTitle: job.title,
        company: job.company
      };
      
      // Create application in database
      const newApplication = await applyForJob(completeApplicationData);
      
      // Update local state
      setApplications(prevApplications => [...prevApplications, newApplication]);
      
      // Update job application count
      // This would ideally be handled by a database trigger or server-side logic
      
      // Send confirmation email
      try {
        if (currentUser.emailPreferences?.applicationUpdates !== false) {
          await sendJobApplicationConfirmation(currentUser, newApplication, job);
        }
      } catch (emailError) {
        console.error("Error sending application confirmation:", emailError);
      }
      
      toast.success('Application submitted successfully!');
      return newApplication;
    } catch (error) {
      toast.error(error.message || 'Failed to submit application');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update application status
  const updateApplicationStatusService = async (applicationId, newStatus, notes = '') => {
    try {
      if (!currentUser || currentUser.role !== 'employer') {
        throw new Error('Only employers can update application status');
      }
      
      // Get application to verify ownership
      const applications = await getJobApplications(null);
      const application = applications.find(app => app.Id === applicationId);
      
      if (!application) {
        throw new Error('Application not found');
      }
      
      // Get the job for this application
      const job = await getJobById(application.jobId);
      
      // Check if employer owns this job
      if (job.employerId !== currentUser.Id) {
        throw new Error('You can only update applications for your own job listings');
      }
      
      // Update application status in database
      const updatedApplication = await updateApplicationStatus(applicationId, newStatus, notes);
      
      // Update local state
      setApplications(prevApplications => {
        const updatedApplications = [...prevApplications];
        const applicationIndex = updatedApplications.findIndex(app => app.Id === applicationId);
        if (applicationIndex !== -1) {
          updatedApplications[applicationIndex] = updatedApplication;
        }
        return updatedApplications;
      });
      
      // Send status update email
      try {
        // We'd need to get the user details from the database
        // For now, we'll assume we have the user object
        await sendApplicationStatusUpdate(
          application.userId, 
          newStatus, 
          updatedApplication, 
          job,
          notes
        );
      } catch (emailError) {
        console.error("Error sending status update email:", emailError);
      }
      
      toast.success(`Application status updated to ${newStatus}`);
      return updatedApplication;
    } catch (error) {
      toast.error(error.message || 'Failed to update application status');
      throw error;
    }
  };

  // Schedule interview
  const scheduleInterviewService = async (applicationId, interviewDetails) => {
    try {
      if (!currentUser || currentUser.role !== 'employer') {
        throw new Error('Only employers can schedule interviews');
      }
      
      // Get application details
      const applications = await getJobApplications(null);
      const application = applications.find(app => app.Id === applicationId);
      
      if (!application) {
        throw new Error('Application not found');
      }
      
      // Get the job for this application
      const job = await getJobById(application.jobId);
      
      // Check if employer owns this job
      if (job.employerId !== currentUser.Id) {
        throw new Error('You can only schedule interviews for your own job listings');
      }
      
      // Prepare interview data
      const completeInterviewData = {
        ...interviewDetails,
        applicationId,
        jobId: application.jobId,
        candidateId: application.userId,
        employerId: currentUser.Id
      };
      
      // Create interview in database
      const newInterview = await scheduleInterview(completeInterviewData);
      
      // Update local state
      setInterviews(prevInterviews => [...prevInterviews, newInterview]);
      
      // Update application status
      await updateApplicationStatusService(
        applicationId, 
        'Interview', 
        `Interview scheduled for ${new Date(interviewDetails.date).toLocaleDateString()} at ${interviewDetails.time}`
      );
      
      // Send interview invitation email
      try {
        // We would need to get the user details from the database
        // For now, we'll simulate having the user object
        await sendInterviewInvitation(
          application.userId,
          newInterview,
          job,
          currentUser
        );
      } catch (emailError) {
        console.error("Error sending interview invitation:", emailError);
      }
      
      toast.success('Interview scheduled successfully!');
      return newInterview;
    } catch (error) {
      toast.error(error.message || 'Failed to schedule interview');
      throw error;
    }
  };

  // Check for upcoming deadlines and send reminders
  const checkDeadlines = async () => {
    if (!currentUser) return;
    
    try {
      // Check if user has deadline reminders enabled
      if (currentUser.emailPreferences?.deadlineReminders === false) {
        return;
      }
      
      // Get user's applications
      const userApplications = await getUserApplications(currentUser.Id);
      
      // Get existing notifications
      const notifications = await getAllDeadlineNotifications();
      
      // Check for upcoming deadlines
      const today = new Date();
      const upcomingDeadlines = userApplications.filter(app => {
        if (!app.deadline) return false;
        
        const deadlineDate = new Date(app.deadline);
        const diffTime = deadlineDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        // Notify 3 days before deadline
        return diffDays > 0 && diffDays <= 3;
      });
      
      // Send notifications for applications that haven't been notified yet
      for (const app of upcomingDeadlines) {
        const alreadyNotified = notifications.some(
          notification => notification.applicationId === app.Id
        );
        
        if (!alreadyNotified) {
          // Send deadline reminder email
          await sendJobDeadlineReminder(currentUser, app);
          
          // Record notification in database
          const newNotification = await createDeadlineNotification({
            applicationId: app.Id
          });
          
          // Update local state
          setDeadlineNotifications(prev => [...prev, newNotification]);
        }
      }
    } catch (error) {
      console.error("Error checking deadlines:", error);
    }
   
  };

  // Context value
  const value = {
    loading,
    applications,
    getAllJobs: getAllJobsService,
    getJobsByEmployer: getJobsByEmployerService,
    getJobById: getJobByIdService,
    createJob: createJobService,
    updateJob: updateJobService,
    deleteJob: deleteJobService,
    toggleJobStatus: toggleJobStatusService,
    applyForJob: applyForJobService,
    updateApplicationStatus: updateApplicationStatusService,
    scheduleInterview: scheduleInterviewService,
    checkDeadlines
  };

  return <JobContext.Provider value={value}>{children}</JobContext.Provider>;
};

export default JobProvider;