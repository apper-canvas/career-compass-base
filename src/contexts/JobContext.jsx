import { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from './AuthContext';

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
  const { currentUser } = useAuth();

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
    getAllJobs,
    getJobsByEmployer,
    getJobById,
    createJob,
    updateJob,
    deleteJob,
    toggleJobStatus,
    applications
  };

  return <JobContext.Provider value={value}>{children}</JobContext.Provider>;
};

export default JobProvider;