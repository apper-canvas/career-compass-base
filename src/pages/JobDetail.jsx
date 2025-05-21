import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';

// Mock data import - would be fetched from API in production
const mockJobs = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "TechCorp",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$120,000 - $150,000",
    posted: "2 days ago",
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
    companyOverview: "TechCorp is a leading software development company specializing in creating innovative web applications for diverse industries. Founded in 2010, we've grown to over 200 employees across 5 global offices. We pride ourselves on our inclusive work environment and cutting-edge technical solutions."
  },
  {
    id: 2,
    title: "UX/UI Designer",
    company: "DesignHub",
    location: "Remote",
    type: "Contract",
    salary: "$75 - $95 per hour",
    posted: "1 week ago",
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
    companyOverview: "DesignHub is a creative agency specializing in digital product design. We work with startups and established companies to create beautiful, functional, and user-friendly digital experiences. Our team consists of designers, researchers, and strategists who are passionate about solving complex design challenges."
  },
  {
    id: 3,
    title: "Product Manager",
    company: "GrowthStartup",
    location: "New York, NY",
    type: "Full-time",
    salary: "$110,000 - $140,000",
    posted: "3 days ago",
    description: "Lead product development for our SaaS platform, working with engineering and design teams.",
    requirements: "3+ years in product management, experience with agile methodologies, technical background preferred",
    industry: "Technology",
    responsibilities: [
      "Define product vision, strategy, and roadmap based on market research and user feedback",
      "Lead cross-functional teams through the product development lifecycle",
      "Gather and prioritize product requirements",
      "Work closely with engineering and design teams to deliver high-quality products",
      "Analyze product metrics and make data-driven decisions"
    ],
    qualifications: [
      "3+ years of experience in product management",
      "Experience with agile methodologies and product development cycles",
      "Strong analytical and problem-solving skills",
      "Excellent communication and stakeholder management abilities",
      "Technical background preferred but not required"
    ],
    companyOverview: "GrowthStartup is a fast-growing technology company focused on developing innovative SaaS solutions for businesses. Founded by former tech executives, our mission is to simplify complex business processes through intuitive software. We've secured Series B funding and are rapidly expanding our team across all departments."
  },
  {
    id: 4,
    title: "Marketing Specialist",
    company: "BrandBoost",
    location: "Chicago, IL",
    type: "Full-time",
    salary: "$65,000 - $85,000",
    posted: "5 days ago",
    description: "Create and execute marketing campaigns across various channels to drive customer acquisition.",
    requirements: "Experience in digital marketing, knowledge of SEO and content marketing, analytical skills",
    industry: "Marketing",
    responsibilities: [
      "Plan and execute multi-channel marketing campaigns",
      "Create compelling content for digital platforms",
      "Manage social media accounts and engage with online communities",
      "Analyze campaign performance and optimize based on data",
      "Collaborate with design team on marketing materials"
    ],
    qualifications: [
      "Proven experience in digital marketing",
      "Knowledge of SEO, SEM, and content marketing strategies",
      "Experience with marketing analytics tools",
      "Strong written and verbal communication skills",
      "Bachelor's degree in Marketing, Communications, or related field"
    ],
    companyOverview: "BrandBoost is a marketing agency that helps businesses increase their online presence and attract more customers. We specialize in digital marketing strategies that drive measurable results. Our team of marketing experts works with clients across various industries to create customized marketing solutions."
  },
  {
    id: 5,
    title: "Data Scientist",
    company: "DataInsights",
    location: "Boston, MA",
    type: "Full-time",
    salary: "$130,000 - $160,000",
    posted: "1 day ago",
    description: "Develop machine learning models to extract insights from large datasets and support business decisions.",
    requirements: "Strong background in statistics, experience with Python and ML libraries, PhD preferred",
    industry: "Data Science",
    responsibilities: [
      "Design and implement machine learning models to solve business problems",
      "Process, cleanse, and verify data integrity for analysis",
      "Perform exploratory data analysis and feature engineering",
      "Collaborate with engineering teams to deploy models to production",
      "Communicate findings and insights to non-technical stakeholders"
    ],
    qualifications: [
      "Strong background in statistics and mathematics",
      "Experience with Python and machine learning libraries (Scikit-learn, TensorFlow, PyTorch)",
      "Knowledge of data visualization techniques",
      "Experience working with large datasets",
      "PhD in Computer Science, Statistics, or related field preferred"
    ],
    companyOverview: "DataInsights is a data science consultancy that helps organizations leverage their data to make better decisions. Our team of data scientists, engineers, and analysts develops custom machine learning solutions for clients across healthcare, finance, retail, and other industries. We're committed to using data science ethically to solve real-world problems."
  }
];

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  const BackIcon = getIcon('arrow-left');
  const BuildingIcon = getIcon('building');
  const MapPinIcon = getIcon('map-pin');
  const BriefcaseIcon = getIcon('briefcase');
  const DollarSignIcon = getIcon('dollar-sign');
  const BookmarkIcon = getIcon('bookmark');
  const BookmarkFilledIcon = getIcon('bookmark-filled');

  useEffect(() => {
    // Simulate API call to fetch job details
    setIsLoading(true);
    const jobData = mockJobs.find(job => job.id === parseInt(id));
    
    if (jobData) {
      setJob(jobData);
      setIsLoading(false);
    } else {
      // Job not found, redirect to 404
      navigate('/not-found');
    }
  }, [id, navigate]);

  const handleApply = () => {
    toast.success("Application submitted successfully!");
  };

  const handleSaveJob = () => {
    setIsSaved(!isSaved);
    if (!isSaved) {
      toast.success("Job saved to your profile");
    } else {
      toast.info("Job removed from saved jobs");
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-surface-200 dark:bg-surface-700 rounded w-3/4 mb-4"></div>
          <div className="h-6 bg-surface-200 dark:bg-surface-700 rounded w-1/2 mb-6"></div>
          <div className="h-40 bg-surface-200 dark:bg-surface-700 rounded mb-6"></div>
          <div className="h-60 bg-surface-200 dark:bg-surface-700 rounded mb-6"></div>
          <div className="h-40 bg-surface-200 dark:bg-surface-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-primary hover:text-primary-dark mb-6"
        >
          <BackIcon className="h-4 w-4 mr-1" /> Back to Jobs
        </button>
        
        {/* Job Header */}
        <div className="card mb-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{job.title}</h1>
              <div className="flex flex-wrap gap-y-2 gap-x-4 text-surface-600 dark:text-surface-300">
                <div className="flex items-center">
                  <BuildingIcon className="h-4 w-4 mr-1" />
                  <span>{job.company}</span>
                </div>
                <div className="flex items-center">
                  <MapPinIcon className="h-4 w-4 mr-1" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center">
                  <BriefcaseIcon className="h-4 w-4 mr-1" />
                  <span>{job.type}</span>
                </div>
                <div className="flex items-center">
                  <DollarSignIcon className="h-4 w-4 mr-1" />
                  <span>{job.salary}</span>
                </div>
              </div>
              <div className="mt-4">
                <span className="inline-block bg-surface-100 dark:bg-surface-700 rounded-full px-3 py-1 text-sm font-medium">
                  {job.industry}
                </span>
                <span className="inline-block bg-primary bg-opacity-10 text-primary rounded-full px-3 py-1 text-sm font-medium ml-2">
                  Posted {job.posted}
                </span>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={handleSaveJob}
                className={`flex items-center gap-2 btn ${isSaved ? 'btn-primary' : 'btn-outline'}`}
              >
                {isSaved ? <BookmarkFilledIcon className="h-5 w-5" /> : <BookmarkIcon className="h-5 w-5" />}
                {isSaved ? 'Saved' : 'Save Job'}
              </button>
              <button 
                onClick={handleApply}
                className="btn btn-primary"
              >
                Apply Now
              </button>
            </div>
          </div>
        </div>
        
        {/* Job Description */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Overview */}
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Job Description</h2>
              <p className="text-surface-700 dark:text-surface-300">{job.description}</p>
            </div>
            
            {/* Responsibilities */}
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Responsibilities</h2>
              <ul className="list-disc pl-5 space-y-2 text-surface-700 dark:text-surface-300">
                {job.responsibilities.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
            
            {/* Qualifications */}
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Required Qualifications</h2>
              <ul className="list-disc pl-5 space-y-2 text-surface-700 dark:text-surface-300">
                {job.qualifications.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Company Overview */}
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Company Overview</h2>
              <p className="text-surface-700 dark:text-surface-300">{job.companyOverview}</p>
            </div>
            
            {/* Apply Sidebar */}
            <div className="card bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
              <h3 className="text-lg font-semibold mb-3">Ready to Apply?</h3>
              <p className="text-surface-600 dark:text-surface-400 mb-4">
                Submit your application now to be considered for this position.
              </p>
              <button 
                onClick={handleApply}
                className="btn btn-primary w-full mb-3"
              >
                Apply Now
              </button>
              <button 
                onClick={handleSaveJob}
                className="btn btn-outline w-full"
              >
                {isSaved ? 'Remove from Saved' : 'Save for Later'}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default JobDetail;