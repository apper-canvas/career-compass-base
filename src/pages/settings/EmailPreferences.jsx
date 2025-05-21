import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { getIcon } from '../../utils/iconUtils';

const EmailPreferences = () => {
  const { currentUser, updateEmailPreferences } = useAuth();
  const [preferences, setPreferences] = useState({
    applicationUpdates: true,
    jobRecommendations: true,
    interviewInvitations: true,
    deadlineReminders: true,
    marketingEmails: false,
    accountNotifications: true
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  // Icons
  const BellIcon = getIcon('bell');
  const MailIcon = getIcon('mail');
  const ArrowLeftIcon = getIcon('arrow-left');
  const CheckIcon = getIcon('check');
  const AlertCircleIcon = getIcon('alert-circle');
  const CalendarIcon = getIcon('calendar');
  const ClockIcon = getIcon('clock');
  const BriefcaseIcon = getIcon('briefcase');
  const UserIcon = getIcon('user');
  
  // Load user preferences on component mount
  useEffect(() => {
    if (currentUser && currentUser.emailPreferences) {
      setPreferences(currentUser.emailPreferences);
    }
  }, [currentUser]);
  
  // Handle toggle change
  const handleToggle = (preference) => {
    setPreferences(prev => ({
      ...prev,
      [preference]: !prev[preference]
    }));
  };
  
  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      await updateEmailPreferences(preferences);
      toast.success('Email preferences updated successfully');
    } catch (error) {
      toast.error('Failed to update preferences');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate(-1)} 
          className="mr-4 p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-800"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-bold flex items-center">
          <MailIcon className="h-6 w-6 mr-2 text-primary" />
          Email Notification Preferences
        </h1>
      </div>
      
      <div className="card border border-surface-200 dark:border-surface-700 mb-6">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="applicationUpdates"
                    name="applicationUpdates"
                    type="checkbox"
                    checked={preferences.applicationUpdates}
                    onChange={() => handleToggle('applicationUpdates')}
                    className="h-4 w-4 rounded border-surface-300 text-primary focus:ring-primary"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="applicationUpdates" className="font-medium">
                    <div className="flex items-center">
                      <AlertCircleIcon className="h-4 w-4 mr-1 text-primary" />
                      Application Status Updates
                    </div>
                  </label>
                  <p className="text-surface-500 dark:text-surface-400">Receive notifications when your application status changes</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="interviewInvitations"
                    name="interviewInvitations"
                    type="checkbox"
                    checked={preferences.interviewInvitations}
                    onChange={() => handleToggle('interviewInvitations')}
                    className="h-4 w-4 rounded border-surface-300 text-primary focus:ring-primary"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="interviewInvitations" className="font-medium">
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-1 text-primary" />
                      Interview Invitations
                    </div>
                  </label>
                  <p className="text-surface-500 dark:text-surface-400">Receive notifications about interview invitations and schedules</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="deadlineReminders"
                    name="deadlineReminders"
                    type="checkbox"
                    checked={preferences.deadlineReminders}
                    onChange={() => handleToggle('deadlineReminders')}
                    className="h-4 w-4 rounded border-surface-300 text-primary focus:ring-primary"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="deadlineReminders" className="font-medium">
                    <div className="flex items-center">
                      <ClockIcon className="h-4 w-4 mr-1 text-primary" />
                      Deadline Reminders
                    </div>
                  </label>
                  <p className="text-surface-500 dark:text-surface-400">Receive reminders about approaching application deadlines</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="jobRecommendations"
                    name="jobRecommendations"
                    type="checkbox"
                    checked={preferences.jobRecommendations}
                    onChange={() => handleToggle('jobRecommendations')}
                    className="h-4 w-4 rounded border-surface-300 text-primary focus:ring-primary"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="jobRecommendations" className="font-medium">
                    <div className="flex items-center">
                      <BriefcaseIcon className="h-4 w-4 mr-1 text-primary" />
                      Job Recommendations
                    </div>
                  </label>
                  <p className="text-surface-500 dark:text-surface-400">Receive personalized job recommendations based on your profile</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="accountNotifications"
                    name="accountNotifications"
                    type="checkbox"
                    checked={preferences.accountNotifications}
                    onChange={() => handleToggle('accountNotifications')}
                    className="h-4 w-4 rounded border-surface-300 text-primary focus:ring-primary"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="accountNotifications" className="font-medium">
                    <div className="flex items-center">
                      <UserIcon className="h-4 w-4 mr-1 text-primary" />
                      Account Notifications
                    </div>
                  </label>
                  <p className="text-surface-500 dark:text-surface-400">Receive important account-related notifications</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="marketingEmails"
                    name="marketingEmails"
                    type="checkbox"
                    checked={preferences.marketingEmails}
                    onChange={() => handleToggle('marketingEmails')}
                    className="h-4 w-4 rounded border-surface-300 text-primary focus:ring-primary"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="marketingEmails" className="font-medium">
                    <div className="flex items-center">
                      <BellIcon className="h-4 w-4 mr-1 text-primary" />
                      Marketing Emails
                    </div>
                  </label>
                  <p className="text-surface-500 dark:text-surface-400">Receive promotional emails about our services and features</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end mt-8">
            <button 
              type="submit"
              disabled={loading}
              className="btn btn-primary inline-flex items-center"
            >
              {loading ? (
                <span className="inline-flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                <>
                  <CheckIcon className="h-4 w-4 mr-2" />
                  Save Preferences
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-blue-800 dark:text-blue-300 text-sm">
        <h3 className="font-medium mb-2 flex items-center">
          <MailIcon className="h-4 w-4 mr-1" />
          About Email Notifications
        </h3>
        <p className="mb-2">
          We send personalized emails to help you stay updated on your job search. All emails include your name and relevant information about jobs you've applied to.
        </p>
        <p>
          You can change your preferences at any time or unsubscribe from any email by clicking the unsubscribe link at the bottom of our emails.
        </p>
      </div>
    </div>
  );
};

export default EmailPreferences;