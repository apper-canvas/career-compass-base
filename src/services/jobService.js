/**
 * Job Service - Handles all job-related operations
 */
const getJobClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

/**
 * Get all active jobs
 * @param {Object} options - Optional params for filtering, sorting, pagination
 * @returns {Promise} - Promise resolving to array of jobs
 */
export const getAllJobs = async (options = {}) => {
  try {
    const client = getJobClient();
    
    const params = {
      fields: [
        'Name', 'title', 'company', 'location', 'type', 'salary',
        'description', 'requirements', 'industry', 'responsibilities',
        'qualifications', 'employerName', 'postedDate', 'status',
        'applications', 'views', 'lastUpdated', 'employerId'
      ],
      where: [
        {
          fieldName: "status",
          operator: "ExactMatch",
          values: ["active"]
        }
      ],
      orderBy: [
        {
          fieldName: "postedDate",
          SortType: "DESC"
        }
      ],
      pagingInfo: {
        limit: options.limit || 20,
        offset: options.offset || 0
      }
    };
    
    // Add search filter if provided
    if (options.search) {
      params.where.push({
        fieldName: "title",
        operator: "Contains",
        values: [options.search]
      });
    }
    
    // Add location filter if provided
    if (options.location) {
      params.where.push({
        fieldName: "location",
        operator: "Contains",
        values: [options.location]
      });
    }
    
    // Add job type filter if provided
    if (options.type) {
      params.where.push({
        fieldName: "type",
        operator: "ExactMatch",
        values: [options.type]
      });
    }
    
    const response = await client.fetchRecords('job', params);
    
    if (!response || !response.data) {
      return [];
    }
    
    return response.data;
  } catch (error) {
    console.error("Error fetching jobs:", error);
    throw error;
  }
};

/**
 * Get jobs by employer ID
 * @param {string} employerId - The employer ID to fetch jobs for
 * @returns {Promise} - Promise resolving to array of jobs
 */
export const getJobsByEmployer = async (employerId) => {
  try {
    const client = getJobClient();
    
    const params = {
      fields: [
        'Name', 'title', 'company', 'location', 'type', 'salary',
        'description', 'requirements', 'industry', 'responsibilities',
        'qualifications', 'employerName', 'postedDate', 'status',
        'applications', 'views', 'lastUpdated', 'employerId'
      ],
      where: [
        {
          fieldName: "employerId",
          operator: "EqualTo",
          values: [employerId]
        }
      ],
      orderBy: [
        {
          fieldName: "postedDate",
          SortType: "DESC"
        }
      ]
    };
    
    const response = await client.fetchRecords('job', params);
    
    if (!response || !response.data) {
      return [];
    }
    
    return response.data;
  } catch (error) {
    console.error("Error fetching employer jobs:", error);
    throw error;
  }
};

/**
 * Get job by ID
 * @param {string} jobId - The ID of the job to fetch
 * @returns {Promise} - Promise resolving to job data
 */
export const getJobById = async (jobId) => {
  try {
    const client = getJobClient();
    
    const params = {
      fields: [
        'Name', 'title', 'company', 'location', 'type', 'salary',
        'description', 'requirements', 'industry', 'responsibilities',
        'qualifications', 'employerName', 'postedDate', 'status',
        'applications', 'views', 'lastUpdated', 'employerId'
      ]
    };
    
    const response = await client.getRecordById('job', jobId, params);
    
    if (!response || !response.data) {
      return null;
    }
    
    return response.data;
  } catch (error) {
    console.error("Error fetching job:", error);
    throw error;
  }
};

/**
 * Create a new job
 * @param {Object} jobData - Job data to create
 * @returns {Promise} - Promise resolving to created job data
 */
export const createJob = async (jobData) => {
  try {
    const client = getJobClient();
    
    // Ensure responsibilities and qualifications are properly formatted
    const responsibilities = Array.isArray(jobData.responsibilities) 
      ? jobData.responsibilities.join(',')
      : jobData.responsibilities;
      
    const qualifications = Array.isArray(jobData.qualifications)
      ? jobData.qualifications.join(',')
      : jobData.qualifications;
    
    const params = {
      records: [{
        Name: jobData.title,
        title: jobData.title,
        company: jobData.company,
        location: jobData.location,
        type: jobData.type,
        salary: jobData.salary,
        description: jobData.description,
        requirements: jobData.requirements,
        industry: jobData.industry,
        responsibilities: responsibilities,
        qualifications: qualifications,
        employerName: jobData.employerName,
        employerId: jobData.employerId,
        postedDate: new Date().toISOString(),
        status: 'active',
        applications: 0,
        views: 0
      }]
    };
    
    const response = await client.createRecord('job', params);
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to create job');
    }
    
    return response.results[0].data;
  } catch (error) {
    console.error("Error creating job:", error);
    throw error;
  }
};

/**
 * Update an existing job
 * @param {string} jobId - Job ID to update
 * @param {Object} jobData - Job data to update
 * @returns {Promise} - Promise resolving to updated job data
 */
export const updateJob = async (jobId, jobData) => {
  try {
    const client = getJobClient();
    
    // Format array fields for the database
    const responsibilities = Array.isArray(jobData.responsibilities) 
      ? jobData.responsibilities.join(',')
      : jobData.responsibilities;
      
    const qualifications = Array.isArray(jobData.qualifications)
      ? jobData.qualifications.join(',')
      : jobData.qualifications;
    
    const params = {
      records: [{
        Id: jobId,
        Name: jobData.title,
        title: jobData.title,
        company: jobData.company,
        location: jobData.location,
        type: jobData.type,
        salary: jobData.salary,
        description: jobData.description,
        requirements: jobData.requirements,
        industry: jobData.industry,
        responsibilities: responsibilities,
        qualifications: qualifications,
        lastUpdated: new Date().toISOString(),
        status: jobData.status || 'active'
      }]
    };
    
    const response = await client.updateRecord('job', params);
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to update job');
    }
    
    return response.results[0].data;
  } catch (error) {
    console.error("Error updating job:", error);
    throw error;
  }
};

/**
 * Delete job (soft delete by changing status)
 * @param {string} jobId - Job ID to delete
 * @returns {Promise} - Promise resolving to success status
 */
export const deleteJob = async (jobId) => {
  try {
    const client = getJobClient();
    
    const params = {
      records: [{
        Id: jobId,
        status: 'deleted'
      }]
    };
    
    const response = await client.updateRecord('job', params);
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to delete job');
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting job:", error);
    throw error;
  }
};

/**
 * Toggle job status (active/inactive)
 * @param {string} jobId - Job ID to toggle status
 * @param {string} currentStatus - Current status to determine new status
 * @returns {Promise} - Promise resolving to updated job data
 */
export const toggleJobStatus = async (jobId, currentStatus) => {
  try {
    const client = getJobClient();
    
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    
    const params = {
      records: [{
        Id: jobId,
        status: newStatus
      }]
    };
    
    const response = await client.updateRecord('job', params);
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to update job status');
    }
    
    return response.results[0].data;
  } catch (error) {
    console.error("Error toggling job status:", error);
    throw error;
  }
};