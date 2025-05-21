/**
 * Application Service - Handles all job application operations
 */
const getApplicationClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

/**
 * Get all applications for a user
 * @param {string} userId - The user ID to fetch applications for
 * @returns {Promise} - Promise resolving to array of applications
 */
export const getUserApplications = async (userId) => {
  try {
    const client = getApplicationClient();
    
    const params = {
      fields: [
        'Name', 'jobTitle', 'company', 'status', 'dateApplied',
        'statusUpdatedAt', 'notes', 'deadline', 'jobId', 'userId'
      ],
      where: [
        {
          fieldName: "userId",
          operator: "EqualTo",
          values: [userId]
        }
      ],
      orderBy: [
        {
          fieldName: "dateApplied",
          SortType: "DESC"
        }
      ]
    };
    
    const response = await client.fetchRecords('application', params);
    
    if (!response || !response.data) {
      return [];
    }
    
    return response.data;
  } catch (error) {
    console.error("Error fetching user applications:", error);
    throw error;
  }
};

/**
 * Get all applications for a job
 * @param {string} jobId - The job ID to fetch applications for
 * @returns {Promise} - Promise resolving to array of applications
 */
export const getJobApplications = async (jobId) => {
  try {
    const client = getApplicationClient();
    
    const params = {
      fields: [
        'Name', 'jobTitle', 'company', 'status', 'dateApplied',
        'statusUpdatedAt', 'notes', 'deadline', 'jobId', 'userId'
      ],
      where: [
        {
          fieldName: "jobId",
          operator: "EqualTo",
          values: [jobId]
        }
      ],
      orderBy: [
        {
          fieldName: "dateApplied",
          SortType: "DESC"
        }
      ]
    };
    
    const response = await client.fetchRecords('application', params);
    
    if (!response || !response.data) {
      return [];
    }
    
    return response.data;
  } catch (error) {
    console.error("Error fetching job applications:", error);
    throw error;
  }
};

/**
 * Apply for a job
 * @param {Object} applicationData - Application data
 * @returns {Promise} - Promise resolving to created application data
 */
export const applyForJob = async (applicationData) => {
  try {
    const client = getApplicationClient();
    
    // Format the deadline if it exists
    let deadline = null;
    if (applicationData.deadline) {
      if (applicationData.deadline instanceof Date) {
        deadline = applicationData.deadline.toISOString().split('T')[0];
      } else if (typeof applicationData.deadline === 'string') {
        deadline = applicationData.deadline;
      }
    }
    
    const params = {
      records: [{
        Name: `${applicationData.jobTitle} Application`,
        jobTitle: applicationData.jobTitle,
        company: applicationData.company,
        status: 'Applied',
        dateApplied: new Date().toISOString(),
        notes: applicationData.notes || '',
        deadline: deadline,
        jobId: applicationData.jobId,
        userId: applicationData.userId
      }]
    };
    
    const response = await client.createRecord('application', params);
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to submit application');
    }
    
    return response.results[0].data;
  } catch (error) {
    console.error("Error applying for job:", error);
    throw error;
  }
};

/**
 * Update application status
 * @param {string} applicationId - Application ID to update
 * @param {string} status - New status
 * @param {string} notes - Optional notes about the status change
 * @returns {Promise} - Promise resolving to updated application data
 */
export const updateApplicationStatus = async (applicationId, status, notes = '') => {
  try {
    const client = getApplicationClient();
    
    const params = {
      records: [{
        Id: applicationId,
        status: status,
        statusUpdatedAt: new Date().toISOString(),
        notes: notes
      }]
    };
    
    const response = await client.updateRecord('application', params);
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to update application status');
    }
    
    return response.results[0].data;
  } catch (error) {
    console.error("Error updating application status:", error);
    throw error;
  }
};