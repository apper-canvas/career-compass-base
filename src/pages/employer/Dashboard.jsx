import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getIcon } from '../../utils/iconUtils';
import { useAuth } from '../../contexts/AuthContext';
import { useJob } from '../../contexts/JobContext';
import Chart from 'react-apexcharts';

const EmployerDashboard = () => {
  const { currentUser } = useAuth();
  const { getJobsByEmployer, loading } = useJob();
  const [employerJobs, setEmployerJobs] = useState([]);
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalApplications: 0,
    totalViews: 0,
    conversionRate: 0,
  });

  const PlusIcon = getIcon('plus');
  const BriefcaseIcon = getIcon('briefcase');
  const UsersIcon = getIcon('users');
  const EyeIcon = getIcon('eye');
  const PercentIcon = getIcon('percent');
  const EditIcon = getIcon('edit');
  const BarChartIcon = getIcon('bar-chart');
  const TrendingUpIcon = getIcon('trending-up');

  // Get employer's jobs and calculate statistics
  useEffect(() => {
    if (!loading && currentUser) {
      const jobs = getJobsByEmployer(currentUser.id);
      setEmployerJobs(jobs);
      
      // Calculate statistics
      const activeJobsCount = jobs.filter(job => job.status === 'active').length;
      const totalApplicationsCount = jobs.reduce((total, job) => total + (job.applications || 0), 0);
      const totalViewsCount = jobs.reduce((total, job) => total + (job.views || 0), 0);
      const rate = totalViewsCount > 0 ? (totalApplicationsCount / totalViewsCount) * 100 : 0;
      
      setStats({
        activeJobs: activeJobsCount,
        totalApplications: totalApplicationsCount,
        totalViews: totalViewsCount,
        conversionRate: rate.toFixed(1)
      });
    }
  }, [loading, currentUser, getJobsByEmployer]);

  // Charts configuration
  const applicationsChartOptions = {
    chart: {
      type: 'bar',
      toolbar: {
        show: false
      },
      fontFamily: 'Inter, ui-sans-serif, system-ui'
    },
    colors: ['#4361ee'],
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: false,
      }
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: employerJobs.slice(0, 5).map(job => job.title.substring(0, 15) + '...'),
    },
    yaxis: {
      title: {
        text: 'Applications'
      }
    },
    tooltip: {
      theme: 'dark'
    }
  };

  const applicationsChartSeries = [
    {
      name: 'Applications',
      data: employerJobs.slice(0, 5).map(job => job.applications || 0)
    }
  ];

  // Views chart configuration
  const viewsChartOptions = {
    chart: {
      type: 'line',
      toolbar: {
        show: false
      },
      fontFamily: 'Inter, ui-sans-serif, system-ui'
    },
    colors: ['#3a0ca3'],
    stroke: {
      curve: 'smooth',
      width: 4
    },
    markers: {
      size: 5
    },
    xaxis: {
      categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4']
    },
    tooltip: {
      theme: 'dark'
    }
  };

  const viewsChartSeries = [
    {
      name: 'Views',
      data: [35, 65, 45, 78]
    }
  ];

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Employer Dashboard</h1>
        <p className="text-surface-600 dark:text-surface-400">
          Welcome back, {currentUser?.companyName || `${currentUser?.firstName} ${currentUser?.lastName}`}! Manage your job listings and track applications.
        </p>
      </motion.div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Link to="/employer/post-job" className="card hover:shadow-lg transition-shadow bg-gradient-to-r from-primary to-primary-light text-white">
          <div className="flex items-center">
            <div className="mr-4 p-3 bg-white bg-opacity-20 rounded-full">
              <PlusIcon className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-1">Post a New Job</h3>
              <p className="text-white text-opacity-90">Create a new job listing to find the perfect candidate</p>
            </div>
          </div>
        </Link>
        <Link to="/employer/manage-jobs" className="card hover:shadow-lg transition-shadow bg-gradient-to-r from-secondary to-secondary-light text-white">
          <div className="flex items-center">
            <div className="mr-4 p-3 bg-white bg-opacity-20 rounded-full">
              <EditIcon className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-1">Manage Job Listings</h3>
              <p className="text-white text-opacity-90">Edit, update or remove your existing job listings</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-primary bg-opacity-10 rounded-full mr-4">
              <BriefcaseIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-surface-500 dark:text-surface-400 text-sm">Active Jobs</p>
              <h4 className="text-2xl font-bold">{stats.activeJobs}</h4>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-secondary bg-opacity-10 rounded-full mr-4">
              <UsersIcon className="h-6 w-6 text-secondary" />
            </div>
            <div>
              <p className="text-surface-500 dark:text-surface-400 text-sm">Total Applications</p>
              <h4 className="text-2xl font-bold">{stats.totalApplications}</h4>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-accent bg-opacity-10 rounded-full mr-4">
              <EyeIcon className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-surface-500 dark:text-surface-400 text-sm">Total Views</p>
              <h4 className="text-2xl font-bold">{stats.totalViews}</h4>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-primary bg-opacity-10 rounded-full mr-4">
              <PercentIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-surface-500 dark:text-surface-400 text-sm">Conversion Rate</p>
              <h4 className="text-2xl font-bold">{stats.conversionRate}%</h4>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Applications by Job</h3>
            <BarChartIcon className="h-5 w-5 text-primary" />
          </div>
          {employerJobs.length > 0 ? (
            <Chart 
              options={applicationsChartOptions} 
              series={applicationsChartSeries} 
              type="bar" 
              height={300} 
            />
          ) : (
            <div className="flex justify-center items-center h-64 text-surface-500 dark:text-surface-400">
              No job data available
            </div>
          )}
        </div>
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Job Views Trend</h3>
            <TrendingUpIcon className="h-5 w-5 text-secondary" />
          </div>
          <Chart 
            options={viewsChartOptions} 
            series={viewsChartSeries} 
            type="line" 
            height={300} 
          />
        </div>
      </div>

      {/* Recent Jobs */}
      <div className="card mb-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Recent Job Postings</h3>
          <Link to="/employer/manage-jobs" className="text-primary hover:text-primary-dark text-sm font-medium">
            View All Jobs
          </Link>
        </div>
        
        {employerJobs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-surface-200 dark:divide-surface-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Applications</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Posted Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-200 dark:divide-surface-700">
                {employerJobs.slice(0, 5).map((job) => (
                  <tr key={job.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{job.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${job.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                         'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}`}>
                        {job.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{job.applications || 0}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{new Date(job.postedDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link to={`/employer/edit-job/${job.id}`} className="text-primary hover:text-primary-dark mr-4">
                        Edit
                      </Link>
                      <Link to={`/job/${job.id}`} className="text-secondary hover:text-secondary-dark">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-surface-500 dark:text-surface-400">
            <BriefcaseIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="mb-4">You haven't posted any jobs yet</p>
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

export default EmployerDashboard;