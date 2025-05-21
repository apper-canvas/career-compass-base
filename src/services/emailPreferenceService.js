/**
 * Email Preference Service - Handles all email preference operations
 */
const getEmailPreferenceClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

/**
 * Get email preferences for a user
 * @param {string} userId - The user ID to fetch preferences for
 * @returns {Promise} - Promise resolving to email preferences
 */
export const getEmailPreferences = async (userId) => {
  try {
    const client = getEmailPreferenceClient();
    const params = {
      fields: [
        'Name', 'applicationUpdates', 'jobRecommendations', 
        'interviewInvitations', 'deadlineReminders', 
        'marketingEmails', 'accountNotifications', 'userId'
      ],
      where: [
        {
          fieldName: "userId",
          operator: "EqualTo",
          values: [userId]
        }
      ]
    };
    
    const response = await client.fetchRecords('email_preference', params);
    
    if (!response || !response.data || response.data.length === 0) {
      return null;
    }
    
    return response.data[0];
  } catch (error) {
    console.error("Error fetching email preferences:", error);
    throw error;
  }
};

/**
 * Create email preferences for a user
 * @param {string} userId - The user ID to create preferences for
 * @param {Object} preferences - Email preference settings
 * @returns {Promise} - Promise resolving to created preferences
 */
export const createEmailPreferences = async (userId, preferences) => {
  try {
    const client = getEmailPreferenceClient();
    
    const params = {
      records: [{
        Name: `Email Preferences for ${userId}`,
        userId: userId,
        applicationUpdates: preferences.applicationUpdates,
        jobRecommendations: preferences.jobRecommendations,
        interviewInvitations: preferences.interviewInvitations,
        deadlineReminders: preferences.deadlineReminders,
        marketingEmails: preferences.marketingEmails,
        accountNotifications: preferences.accountNotifications
      }]
    };
    
    const response = await client.createRecord('email_preference', params);
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to create email preferences');
    }
    
    return response.results[0].data;
  } catch (error) {
    console.error("Error creating email preferences:", error);
    throw error;
  }
};

/**
 * Update email preferences for a user
 * @param {string} preferenceId - The preferences record ID
 * @param {Object} preferences - Email preference settings
 * @returns {Promise} - Promise resolving to updated preferences
 */
export const updateEmailPreferences = async (preferenceId, preferences) => {
  try {
    const client = getEmailPreferenceClient();
    
    const params = {
      records: [{
        Id: preferenceId,
        applicationUpdates: preferences.applicationUpdates,
        jobRecommendations: preferences.jobRecommendations,
        interviewInvitations: preferences.interviewInvitations,
        deadlineReminders: preferences.deadlineReminders,
        marketingEmails: preferences.marketingEmails,
        accountNotifications: preferences.accountNotifications
      }]
    };
    
    const response = await client.updateRecord('email_preference', params);
    return response.results[0].data;
  } catch (error) {
    console.error("Error updating email preferences:", error);
    throw error;
  }
};