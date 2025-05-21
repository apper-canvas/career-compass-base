import { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from './AuthContext';
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
  const [loading, setLoading] = useState(true);
  const [interviews, setInterviews] = useState([]);
  const [deadlineNotifications, setDeadlineNotifications] = useState([]);
  const { currentUser, loading: authLoading } = useAuth();

  // Initialize jobs from localStorage on mount
  useEffect(() => {
    const storedJobs = localStorage.getItem('jobs');
    const storedApplications = localStorage.getItem('applications');
    
    if (storedJobs) {
      setJobs(JSON.parse(storedJobs));
    } else {
      // Initialize with sample data if none exists
      const initialJobs = getSampleJobs();
      setJobs(initialJobs);
      localStorage.setItem('jobs', JSON.stringify(initialJobs));
    }

    if (storedApplications) {
      setApplications(JSON.parse(storedApplications));
    } else {
      localStorage.setItem('applications', JSON.stringify([]));
    }
    
    const storedInterviews = localStorage.getItem('interviews');
    if (storedInterviews) {
      setInterviews(JSON.parse(storedInterviews));
    } else {
      localStorage.setItem('interviews', JSON.stringify([]));
    }
    
    const storedDeadlineNotifications = localStorage.getItem('deadlineNotifications');
    if (storedDeadlineNotifications) {
      setDeadlineNotifications(JSON.parse(storedDeadlineNotifications));
    }
    
    setLoading(false);
  }, []);

  // Save jobs to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('jobs', JSON.stringify(jobs));
    }
  }, [jobs, loading]);

  // Save applications to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('applications', JSON.stringify(applications));
    }
  }, [applications, loading]);

  // Save interviews to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('interviews', JSON.stringify(interviews));
    }
  }, [interviews, loading]);
  
  // Save deadline notifications to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('deadlineNotifications', JSON.stringify(deadlineNotifications));
    }
  }, [deadlineNotifications, loading]);
  
  // Check for upcoming deadlines daily and send reminders
  useEffect(() => {
    if (authLoading || loading || !currentUser) return;
    
    // Check if user has deadline reminders enabled
    if (currentUser.emailPreferences?.deadlineReminders !== false) {
      // Simulate checking for upcoming deadlines
      const checkDeadlines = () => {
        const today = new Date();
        const upcomingDeadlines = applications.filter(app => {
          if (!app.deadline) return false;
          
          const deadlineDate = new Date(app.deadline);
          const diffTime = deadlineDate - today;
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          // Notify 3 days before deadline
          return diffDays > 0 && diffDays <= 3;
        });
        
        // Send deadline notifications for applications that haven't been notified yet
        upcomingDeadlines.forEach(app => {
          const alreadyNotified = deadlineNotifications.some(
            notification => notification.applicationId === app.id
          );
          
          if (!alreadyNotified) {
            // Send deadline reminder email
            sendJobDeadlineReminder(currentUser, app).then(() => {
              // Record that notification was sent
              setDeadlineNotifications(prev => [
                ...prev, 
                { 
                  applicationId: app.id, 
                  sentDate: new Date().toISOString() 
                }
              ]);
            });
          }
        });
      };
      
      // Initial check
      checkDeadlines();
      
      // Schedule daily check (for demo purposes we use shorter interval)
      const intervalId = setInterval(checkDeadlines, 60000 * 5); // Every 5 minutes for demo
      
      return () => clearInterval(intervalId);
    }
  }, [currentUser, applications, deadlineNotifications, loading, authLoading]);

  // Get all jobs
  const getAllJobs = () => {
    return jobs.filter(job => job.status !== 'deleted');
  };

  // Get jobs by employer ID
  const getJobsByEmployer = (employerId) => {
    return jobs.filter(job => job.employerId === employerId && job.status !== 'deleted');
  };

  // Get job by ID
  const getJobById = (jobId) => {
    return jobs.find(job => job.id === jobId && job.status !== 'deleted');
  };

  // Create a new job
  const createJob = async (jobData) => {
    try {
      if (!currentUser || currentUser.role !== 'employer') {
        throw new Error('Only employers can post jobs');
      }

      setLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newJob = {
        ...jobData,
        id: `job_${Date.now()}`,
        employerId: currentUser.id,
        employerName: currentUser.companyName || `${currentUser.firstName} ${currentUser.lastName}'s Company`,
        postedDate: new Date().toISOString(),
        status: 'active',
        applications: 0,
        views: 0
      };
      
      setJobs(prevJobs => [...prevJobs, newJob]);
      
      // If we had real users, we would notify candidates about new job postings
      // For simulation purposes, we could log that notifications would be sent
      console.log('New job posted notification would be sent to matching candidates');
      
      // Here we would trigger email notifications to relevant candidates
      
      toast.success('Job posted successfully!');
      return newJob;
    } catch (error) {
      toast.error(error.message || 'Failed to post job');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing job
  const updateJob = async (jobId, jobData) => {
    try {
      if (!currentUser || currentUser.role !== 'employer') {
        throw new Error('Only employers can update jobs');
      }

      setLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const jobIndex = jobs.findIndex(job => job.id === jobId);
      
      if (jobIndex === -1) {
        throw new Error('Job not found');
      }
      
      // Check if user owns this job
      if (jobs[jobIndex].employerId !== currentUser.id) {
        throw new Error('You can only edit your own job listings');
      }
      
      // Update job
      const updatedJob = { 
        ...jobs[jobIndex], 
        ...jobData, 
        lastUpdated: new Date().toISOString() 
      };
      
      const updatedJobs = [...jobs];
      updatedJobs[jobIndex] = updatedJob;
      
      setJobs(updatedJobs);
      
      toast.success('Job updated successfully!');
      return updatedJob;
    } catch (error) {
      toast.error(error.message || 'Failed to update job');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Delete a job (soft delete)
  const deleteJob = async (jobId) => {
    try {
      if (!currentUser || currentUser.role !== 'employer') {
        throw new Error('Only employers can delete jobs');
      }

      setLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const jobIndex = jobs.findIndex(job => job.id === jobId);
      
      if (jobIndex === -1) {
        throw new Error('Job not found');
      }
      
      // Check if user owns this job
      if (jobs[jobIndex].employerId !== currentUser.id) {
        throw new Error('You can only delete your own job listings');
      }
      
      // Soft delete by setting status to 'deleted'
      const updatedJobs = [...jobs];
      updatedJobs[jobIndex] = { ...updatedJobs[jobIndex], status: 'deleted' };
      
      setJobs(updatedJobs);
      
      // Send emails to all applicants of this job about the deletion
      const jobApplicants = applications.filter(app => app.jobId === jobId);
      jobApplicants.forEach(application => {
        sendApplicationStatusUpdate(application.userId, 'job_closed', application);
      });
      
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
  const toggleJobStatus = async (jobId) => {
    try {
      if (!currentUser || currentUser.role !== 'employer') {
        throw new Error('Only employers can update job status');
      }

      const jobIndex = jobs.findIndex(job => job.id === jobId);
      
      if (jobIndex === -1) {
        throw new Error('Job not found');
      }
      
      // Check if user owns this job
      if (jobs[jobIndex].employerId !== currentUser.id) {
        throw new Error('You can only update your own job listings');
      }
      
      // Toggle between active and inactive
      const newStatus = jobs[jobIndex].status === 'active' ? 'inactive' : 'active';
      
      const updatedJobs = [...jobs];
      updatedJobs[jobIndex] = { ...updatedJobs[jobIndex], status: newStatus };
      
      setJobs(updatedJobs);
      
      toast.success(`Job ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully!`);
      return { ...updatedJobs[jobIndex] };
    } catch (error) {
      toast.error(error.message || 'Failed to update job status');
      throw error;
    }
  };
  
  // Apply for a job
  const applyForJob = async (jobId, applicationData) => {
    try {
      if (!currentUser) {
        throw new Error('You must be logged in to apply for jobs');
      }

      if (currentUser.role !== 'candidate') {
        throw new Error('Only candidates can apply for jobs');
      }

      setLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const job = getJobById(jobId);
      
      if (!job) {
        throw new Error('Job not found');
      }
      
      // Check if user has already applied
      const existingApplication = applications.find(
        app => app.jobId === jobId && app.userId === currentUser.id
      );
      
      if (existingApplication) {
        throw new Error('You have already applied for this job');
      }
      
      // Create application
      const newApplication = {
        id: `app_${Date.now()}`,
        jobId,
        userId: currentUser.id,
        jobTitle: job.title,
        company: job.company,
        status: 'Applied',
        dateApplied: new Date().toISOString(),
        ...applicationData,
        deadline: applicationData.deadline || null
      };
      
      setApplications(prev => [...prev, newApplication]);
      
      // Update job application count
      const jobIndex = jobs.findIndex(j => j.id === jobId);
      const updatedJobs = [...jobs];
      updatedJobs[jobIndex] = { 
        ...updatedJobs[jobIndex], 
        applications: (updatedJobs[jobIndex].applications || 0) + 1 
      };
      
      setJobs(updatedJobs);
      
      // Send confirmation email to candidate
      if (currentUser.emailPreferences?.applicationUpdates !== false) {
        sendJobApplicationConfirmation(currentUser, newApplication, job);
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
  
  // Update application status (for employers)
  const updateApplicationStatus = async (applicationId, newStatus, notes = '') => {
    try {
      if (!currentUser || currentUser.role !== 'employer') {
        throw new Error('Only employers can update application status');
      }

      const applicationIndex = applications.findIndex(app => app.id === applicationId);
      
      if (applicationIndex === -1) {
        throw new Error('Application not found');
      }
      
      // Get the job for this application
      const job = jobs.find(job => job.id === applications[applicationIndex].jobId);
      
      // Check if employer owns this job
      if (job.employerId !== currentUser.id) {
        throw new Error('You can only update applications for your own job listings');
      }
      
      // Update application
      const updatedApplications = [...applications];
      updatedApplications[applicationIndex] = { 
        ...updatedApplications[applicationIndex], 
        status: newStatus,
        statusUpdatedAt: new Date().toISOString(),
        notes: notes || updatedApplications[applicationIndex].notes
      };
      
      setApplications(updatedApplications);
      
      // Get user data for notification
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const applicantUser = users.find(user => user.id === updatedApplications[applicationIndex].userId);
      
      if (applicantUser && applicantUser.emailPreferences?.applicationUpdates !== false) {
        // Send status update email
        sendApplicationStatusUpdate(
          applicantUser, 
          newStatus, 
          updatedApplications[applicationIndex], 
          job,
          notes
        );
      }
      
      toast.success(`Application status updated to ${newStatus}`);
      return updatedApplications[applicationIndex];
    } catch (error) {
      toast.error(error.message || 'Failed to update application status');
      throw error;
    }
  };
  
  // Schedule interview
  const scheduleInterview = async (applicationId, interviewDetails) => {
    try {
      if (!currentUser || currentUser.role !== 'employer') {
        throw new Error('Only employers can schedule interviews');
      }

      const application = applications.find(app => app.id === applicationId);
      
      if (!application) {
        throw new Error('Application not found');
      }
      
      // Get the job for this application
      const job = jobs.find(job => job.id === application.jobId);
      
      // Check if employer owns this job
      if (job.employerId !== currentUser.id) {
        throw new Error('You can only schedule interviews for your own job listings');
      }
      
      // Create interview
      const newInterview = {
        id: `interview_${Date.now()}`,
        applicationId,
        jobId: application.jobId,
        candidateId: application.userId,
        employerId: currentUser.id,
        ...interviewDetails,
        createdAt: new Date().toISOString()
      };
      
      setInterviews(prev => [...prev, newInterview]);
      
      // Update application status to Interview
      await updateApplicationStatus(applicationId, 'Interview', 
        `Interview scheduled for ${new Date(interviewDetails.date).toLocaleDateString()} at ${interviewDetails.time}`
      );
      
      // Get user data for notification
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const applicantUser = users.find(user => user.id === application.userId);
      
      if (applicantUser && applicantUser.emailPreferences?.interviewInvitations !== false) {
        // Send interview invitation email
        sendInterviewInvitation(
          applicantUser,
          newInterview,
          job,
          currentUser
        );
      }
      
      toast.success('Interview scheduled successfully!');
      return newInterview;
    } catch (error) {
      toast.error(error.message || 'Failed to schedule interview');
      throw error;
    }
  };

  // Helper function to get sample job data
  const getSampleJobs = () => {
    const sampleEmployerId = 'employer_123456';
    const sampleEmployerName = 'TechCorp Inc.';
    
    return [
      {
        id: 'job_1',
        title: "Senior Frontend Developer",
        company: "TechCorp",
        location: "San Francisco, CA",
        type: "Full-time",
        salary: "$120,000 - $150,000",
        description: "We're looking for an experienced frontend developer with React expertise to join our growing team.",
        requirements: "5+ years experience with modern JS frameworks, strong TypeScript skills",
        industry: "Technology",
        responsibilities: [
          "Develop and maintain responsive web applications using React and related technologies",
          "Collaborate with back-end developers to integrate front-end components with API services",
          "Implement UI/UX designs and ensure responsive design",
          "Write clean, maintainable, and efficient code",
          "Optimize applications for maximum performance and scalability"
        ],
        qualifications: [
          "5+ years of experience with modern JavaScript frameworks, particularly React",
          "Strong proficiency in TypeScript, HTML5, and CSS3",
          "Experience with state management libraries (Redux, Context API)",
          "Understanding of RESTful APIs and asynchronous request handling",
          "Familiarity with testing frameworks like Jest and React Testing Library"
        ],
        employerId: sampleEmployerId,
        employerName: sampleEmployerName,
        postedDate: new Date('2023-06-15').toISOString(),
        status: 'active',
        applications: 12,
        views: 145
      },
      {
        id: 'job_2',
        title: "UX/UI Designer",
        company: "DesignHub",
        location: "Remote",
        type: "Contract",
        salary: "$75 - $95 per hour",
        description: "Join our creative team to design beautiful and intuitive user interfaces for various client projects.",
        requirements: "Portfolio showcasing UI design skills, experience with Figma, knowledge of design systems",
        industry: "Design",
        responsibilities: [
          "Create user-centered designs by understanding business requirements and user feedback",
          "Design UI elements and components for web and mobile applications",
          "Develop and maintain design systems and style guides",
          "Collaborate with developers to ensure proper implementation of designs",
          "Conduct user research and usability testing"
        ],
        qualifications: [
          "Portfolio demonstrating strong UI/UX design skills",
          "Proficiency in design tools like Figma, Adobe XD, or Sketch",
          "Experience with design systems and component libraries",
          "Knowledge of user-centered design principles",
          "Strong communication and collaboration skills"
        ],
        employerId: 'employer_654321',
        employerName: 'DesignHub Creative',
        postedDate: new Date('2023-06-20').toISOString(),
        status: 'active',
        applications: 8,
        views: 97
      }
    ];
  };

  // Context value
  const value = {
    jobs,
    loading,
    applications,
    interviews,
    getAllJobs,
    getJobsByEmployer,
    getJobById,
    createJob,
    updateJob,
    deleteJob,
    toggleJobStatus,
    applyForJob,
    updateApplicationStatus,
    scheduleInterview
    
  };

  return <JobContext.Provider value={value}>{children}</JobContext.Provider>;
};

export default JobProvider;