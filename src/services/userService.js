/**
 * User Service - Handles all user-related operations
 */
const getUserClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

/**
 * Get user by ID
 * @param {string} userId - The ID of the user to fetch
 * @returns {Promise} - Promise resolving to user data
 */
export const getUserById = async (userId) => {
  try {
    const client = getUserClient();
    const params = {
      fields: [
        'Name', 'Tags', 'email', 'firstName', 'lastName', 
        'role', 'companyName', 'companySize', 'CreatedOn'
      ]
    };
    
    const response = await client.getRecordById('User2', userId, params);
    return response.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

/**
 * Create a new user (on registration)
 * @param {Object} userData - User data to create
 * @returns {Promise} - Promise resolving to created user data
 */
export const createUser = async (userData) => {
  try {
    const client = getUserClient();
    
    // Filter to only include updateable fields
    const params = {
      records: [{
        Name: `${userData.firstName} ${userData.lastName}`,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role || 'candidate',
        companyName: userData.companyName || '',
        companySize: userData.companySize || 'small'
      }]
    };
    
    const response = await client.createRecord('User2', params);
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to create user');
    }
    
    return response.results[0].data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

/**
 * Update user profile
 * @param {string} userId - User ID to update
 * @param {Object} userData - User data to update
 * @returns {Promise} - Promise resolving to updated user data
 */
export const updateUser = async (userId, userData) => {
  try {
    const client = getUserClient();
    
    // Filter to only include updateable fields
    const params = {
      records: [{
        Id: userId,
        Name: userData.Name || `${userData.firstName} ${userData.lastName}`,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role,
        companyName: userData.companyName,
        companySize: userData.companySize
      }]
    };
    
    const response = await client.updateRecord('User2', params);
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to update user');
    }
    
    return response.results[0].data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

/**
 * Get all users (for admin purposes)
 * @returns {Promise} - Promise resolving to array of users
 */
export const getAllUsers = async () => {
  try {
    const client = getUserClient();
    const params = {
      fields: [
        'Name', 'Tags', 'email', 'firstName', 'lastName', 
        'role', 'companyName', 'companySize', 'CreatedOn'
      ],
      pagingInfo: {
        limit: 100
      }
    };
    
    const response = await client.fetchRecords('User2', params);
    
    if (!response || !response.data) {
      return [];
    }
    
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};