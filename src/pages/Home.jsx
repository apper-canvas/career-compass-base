import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';
import MainFeature from '../components/MainFeature';

// Mock data for jobs
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

const industries = ["Technology", "Design", "Marketing", "Data Science", "Finance", "Healthcare", "Education"];
const jobTypes = ["Full-time", "Part-time", "Contract", "Internship", "Remote"];
const locations = ["San Francisco, CA", "New York, NY", "Chicago, IL", "Boston, MA", "Remote", "Austin, TX", "Seattle, WA"];

// Job Card Component
const JobCard = ({ job, onSave, onApply, saved }) => {
  const BookmarkIcon = getIcon('bookmark');
  const BookmarkFilledIcon = getIcon('bookmark-filled');
  const BuildingIcon = getIcon('building');
  const MapPinIcon = getIcon('map-pin');
  const BriefcaseIcon = getIcon('briefcase');
  const DollarSignIcon = getIcon('dollar-sign');
  const ClockIcon = getIcon('clock');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="card hover:shadow-lg transition-shadow duration-300 border border-surface-200 dark:border-surface-700 overflow-hidden"
    >
      <div className="flex justify-between items-start mb-3">
        <Link to={`/job/${job.id}`} className="hover:text-primary transition-colors">
          <h3 className="text-xl font-semibold text-surface-900 dark:text-white hover:text-primary dark:hover:text-primary-light">
            {job.title}</h3>
        </Link>
        <button 
          onClick={() => onSave(job.id)}
          className="text-surface-500 hover:text-primary dark:text-surface-400 dark:hover:text-primary-light transition-colors"
          aria-label={saved ? "Unsave job" : "Save job"}
        >
          {saved ? 
            <BookmarkFilledIcon className="h-5 w-5 text-primary" /> : 
            <BookmarkIcon className="h-5 w-5" />
          }
        </button>
      </div>
      
      <div className="mb-4">
        <div className="flex items-center text-surface-700 dark:text-surface-300 mb-1">
          <BuildingIcon className="h-4 w-4 mr-2" />
          <span>{job.company}</span>
        </div>
        <div className="flex items-center text-surface-700 dark:text-surface-300 mb-1">
          <MapPinIcon className="h-4 w-4 mr-2" />
          <span>{job.location}</span>
        </div>
        <div className="flex items-center text-surface-700 dark:text-surface-300 mb-1">
          <BriefcaseIcon className="h-4 w-4 mr-2" />
          <span>{job.type}</span>
        </div>
        <div className="flex items-center text-surface-700 dark:text-surface-300 mb-1">
          <DollarSignIcon className="h-4 w-4 mr-2" />
          <span>{job.salary}</span>
        </div>
        <div className="flex items-center text-surface-500 dark:text-surface-400 text-sm">
          <ClockIcon className="h-4 w-4 mr-2" />
          <span>Posted {job.posted}</span>
        </div>
      </div>
      
      <p className="text-surface-700 dark:text-surface-300 mb-4 line-clamp-3">
        {job.description}
      </p>
      
      <div className="flex justify-between items-center pt-3 border-t border-surface-200 dark:border-surface-700">
        <span className="inline-block px-3 py-1 bg-surface-100 dark:bg-surface-700 text-sm rounded-full">
          {job.industry}
        </span>
        <button onClick={() => onApply(job.id)} className="btn btn-primary">
          Apply Now
        </button>
      </div>
      <div className="mt-3 pt-3 text-right">
        <Link to={`/job/${job.id}`} className="text-primary hover:text-primary-dark transition-colors text-sm font-medium">
          View Details →
        </Link>
      </div>
    </motion.div>
  );
};

const Hero = () => {
  const SearchIcon = getIcon('search');
  const BriefcaseIcon = getIcon('briefcase');
  
  return (
    <div className="bg-gradient-to-r from-primary-dark to-primary py-12 md:py-20 text-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-center mb-4">
              <BriefcaseIcon className="h-14 w-14" />
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Find Your Dream Job Today</h1>
            <p className="text-lg md:text-xl opacity-90 mb-8">
              Search thousands of job listings, apply with ease, and track your progress all in one place.
            </p>
            
            <div className="bg-white dark:bg-surface-800 p-2 rounded-xl shadow-lg">
              <div className="flex flex-col md:flex-row gap-2">
                <div className="relative flex-grow">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400 h-5 w-5" />
                  <input 
                    type="text" 
                    placeholder="Job title, keywords, or company" 
                    className="pl-10 py-3 w-full rounded-lg bg-surface-50 dark:bg-surface-700 border-0 focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>
                <button className="btn btn-primary py-3 whitespace-nowrap">
                  Find Jobs
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const Home = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState(mockJobs);
  const [filters, setFilters] = useState({
    location: '',
    industry: '',
    jobType: '',
    keyword: ''
  });
  
  const handleSaveJob = (jobId) => {
    if (savedJobs.includes(jobId)) {
      setSavedJobs(savedJobs.filter(id => id !== jobId));
      toast.success("Job removed from saved jobs");
    } else {
      setSavedJobs([...savedJobs, jobId]);
      toast.success("Job saved successfully");
    }
  };
  
  const handleApplyJob = (jobId) => {
    toast.success("Application submitted successfully");
  };
  
  const applyFilters = () => {
    let results = [...mockJobs];
    
    if (filters.location) {
      results = results.filter(job => job.location === filters.location);
    }
    
    if (filters.industry) {
      results = results.filter(job => job.industry === filters.industry);
    }
    
    if (filters.jobType) {
      results = results.filter(job => job.type === filters.jobType);
    }
    
    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase();
      results = results.filter(job => 
        job.title.toLowerCase().includes(keyword) || 
        job.company.toLowerCase().includes(keyword) ||
        job.description.toLowerCase().includes(keyword)
      );
    }
    
    setFilteredJobs(results);
  };
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };
  
  useEffect(() => {
    applyFilters();
  }, [filters]);
  
  return (
    <div>
      <Hero />
      
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Filters Panel */}
          <div className="lg:col-span-1">
            <div className="card sticky top-24">
              <h2 className="text-xl font-semibold mb-6">Filter Jobs</h2>
              
              <div className="space-y-5">
                {/* Keyword Search */}
                <div>
                  <label htmlFor="keyword" className="block text-sm font-medium mb-2">
                    Keyword
                  </label>
                  <input
                    type="text"
                    id="keyword"
                    name="keyword"
                    placeholder="Job title or keyword"
                    className="input-field"
                    value={filters.keyword}
                    onChange={handleFilterChange}
                  />
                </div>
                
                {/* Location Filter */}
                <div>
                  <label htmlFor="location" className="block text-sm font-medium mb-2">
                    Location
                  </label>
                  <select
                    id="location"
                    name="location"
                    className="select-field"
                    value={filters.location}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Locations</option>
                    {locations.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>
                
                {/* Industry Filter */}
                <div>
                  <label htmlFor="industry" className="block text-sm font-medium mb-2">
                    Industry
                  </label>
                  <select
                    id="industry"
                    name="industry"
                    className="select-field"
                    value={filters.industry}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Industries</option>
                    {industries.map(industry => (
                      <option key={industry} value={industry}>{industry}</option>
                    ))}
                  </select>
                </div>
                
                {/* Job Type Filter */}
                <div>
                  <label htmlFor="jobType" className="block text-sm font-medium mb-2">
                    Job Type
                  </label>
                  <select
                    id="jobType"
                    name="jobType"
                    className="select-field"
                    value={filters.jobType}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Job Types</option>
                    {jobTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                {/* Reset Filters Button */}
                <button
                  onClick={() => setFilters({
                    location: '',
                    industry: '',
                    jobType: '',
                    keyword: ''
                  })}
                  className="btn btn-outline w-full mt-4"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>
          
          {/* Job Listings */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                {filteredJobs.length} Jobs Found
              </h2>
              <div className="text-sm text-surface-600 dark:text-surface-400">
                Showing {filteredJobs.length} of {mockJobs.length} jobs
              </div>
            </div>
            
            {filteredJobs.length > 0 ? (
              <div className="space-y-6">
                {filteredJobs.map(job => (
                  <JobCard 
                    key={job.id} 
                    job={job} 
                    onSave={handleSaveJob}
                    onApply={handleApplyJob}
                    saved={savedJobs.includes(job.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="card flex flex-col items-center justify-center py-12">
                <div className="text-surface-500 dark:text-surface-400 mb-4">
                  {getIcon('search')({ className: "h-12 w-12" })}
                </div>
                <h3 className="text-xl font-medium mb-2">No Jobs Found</h3>
                <p className="text-surface-600 dark:text-surface-400 text-center max-w-md">
                  We couldn't find any jobs matching your search criteria. Try adjusting your filters or search for something else.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Feature Section */}
      <div className="bg-surface-100 dark:bg-surface-800 py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Organize Your Job Search
            </h2>
            <p className="text-lg text-surface-700 dark:text-surface-300">
              Track applications, upload resumes, and stay organized throughout your job search journey.
            </p>
          </div>
          
          <MainFeature />
        </div>
      </div>
    </div>
  );
};

export default Home;