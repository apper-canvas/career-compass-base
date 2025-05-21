/**
 * Deadline Notification Service - Handles deadline reminder operations
 */
const getDeadlineNotificationClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

/**
 * Get all deadline notifications
 * @returns {Promise} - Promise resolving to array of deadline notifications
 */
export const getAllDeadlineNotifications = async () => {
  try {
    const client = getDeadlineNotificationClient();
    
    const params = {
      fields: [
        'Name', 'sentDate', 'applicationId'
      ],
      orderBy: [
        {
          fieldName: "sentDate",
          SortType: "DESC"
        }
      ]
    };
    
    const response = await client.fetchRecords('deadline_notification', params);
    
    if (!response || !response.data) {
      return [];
    }
    
    return response.data;
  } catch (error) {
    console.error("Error fetching deadline notifications:", error);
    throw error;
  }
};

/**
 * Create a new deadline notification
 * @param {Object} notificationData - Notification data to create
 * @returns {Promise} - Promise resolving to created notification data
 */
export const createDeadlineNotification = async (notificationData) => {
  try {
    const client = getDeadlineNotificationClient();
    
    const params = {
      records: [{
        Name: `Notification for ${notificationData.applicationId}`,
        sentDate: new Date().toISOString(),
        applicationId: notificationData.applicationId
      }]
    };
    
    const response = await client.createRecord('deadline_notification', params);
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to create deadline notification');
    }
    
    return response.results[0].data;
  } catch (error) {
    console.error("Error creating deadline notification:", error);
    throw error;
  }
};