/**
 * Interview Service - Handles all interview scheduling operations
 */
const getInterviewClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

/**
 * Get all interviews for a candidate
 * @param {string} candidateId - The candidate ID to fetch interviews for
 * @returns {Promise} - Promise resolving to array of interviews
 */
export const getCandidateInterviews = async (candidateId) => {
  try {
    const client = getInterviewClient();
    
    const params = {
      fields: [
        'Name', 'date', 'time', 'type', 'locationType', 'location',
        'notes', 'createdAt', 'applicationId', 'jobId', 'candidateId', 'employerId'
      ],
      where: [
        {
          fieldName: "candidateId",
          operator: "EqualTo",
          values: [candidateId]
        }
      ],
      orderBy: [
        {
          fieldName: "date",
          SortType: "ASC"
        }
      ]
    };
    
    const response = await client.fetchRecords('interview', params);
    
    if (!response || !response.data) {
      return [];
    }
    
    return response.data;
  } catch (error) {
    console.error("Error fetching candidate interviews:", error);
    throw error;
  }
};

/**
 * Get all interviews for an employer
 * @param {string} employerId - The employer ID to fetch interviews for
 * @returns {Promise} - Promise resolving to array of interviews
 */
export const getEmployerInterviews = async (employerId) => {
  try {
    const client = getInterviewClient();
    
    const params = {
      fields: [
        'Name', 'date', 'time', 'type', 'locationType', 'location',
        'notes', 'createdAt', 'applicationId', 'jobId', 'candidateId', 'employerId'
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
          fieldName: "date",
          SortType: "ASC"
        }
      ]
    };
    
    const response = await client.fetchRecords('interview', params);
    
    if (!response || !response.data) {
      return [];
    }
    
    return response.data;
  } catch (error) {
    console.error("Error fetching employer interviews:", error);
    throw error;
  }
};

/**
 * Schedule a new interview
 * @param {Object} interviewData - Interview data to create
 * @returns {Promise} - Promise resolving to created interview data
 */
export const scheduleInterview = async (interviewData) => {
  try {
    const client = getInterviewClient();
    
    // Format the date
    const formattedDate = interviewData.date instanceof Date 
      ? interviewData.date.toISOString().split('T')[0]
      : interviewData.date;
    
    const params = {
      records: [{
        Name: `Interview for ${interviewData.jobId}`,
        date: formattedDate,
        time: interviewData.time,
        type: interviewData.type || 'Job Interview',
        locationType: interviewData.locationType,
        location: interviewData.location,
        notes: interviewData.notes || '',
        createdAt: new Date().toISOString(),
        applicationId: interviewData.applicationId,
        jobId: interviewData.jobId,
        candidateId: interviewData.candidateId,
        employerId: interviewData.employerId
      }]
    };
    
    const response = await client.createRecord('interview', params);
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to schedule interview');
    }
    
    return response.results[0].data;
  } catch (error) {
    console.error("Error scheduling interview:", error);
    throw error;
  }
};