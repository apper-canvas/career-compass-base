import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { getEmailPreferences, createEmailPreferences, updateEmailPreferences } from '../../services/emailPreferenceService';
import { getIcon } from '../../utils/iconUtils';

const EmailPreferences = () => {
  const { user } = useSelector((state) => state.user);
  const [preferences, setPreferences] = useState({
    applicationUpdates: true,
    jobRecommendations: true,
    interviewInvitations: true,
    deadlineReminders: true,
    marketingEmails: false,
    accountNotifications: true
  });
  const [originalPreferences, setOriginalPreferences] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [preferenceId, setPreferenceId] = useState(null);

  // Load email preferences on component mount
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        setLoading(true);
        const userPreferences = await getEmailPreferences(user.Id);
        
        if (userPreferences) {
          setPreferenceId(userPreferences.Id);
          setPreferences({
            applicationUpdates: userPreferences.applicationUpdates,
            jobRecommendations: userPreferences.jobRecommendations,
            interviewInvitations: userPreferences.interviewInvitations,
            deadlineReminders: userPreferences.deadlineReminders,
            marketingEmails: userPreferences.marketingEmails,
            accountNotifications: userPreferences.accountNotifications
          });
          setOriginalPreferences({
            applicationUpdates: userPreferences.applicationUpdates,
            jobRecommendations: userPreferences.jobRecommendations,
            interviewInvitations: userPreferences.interviewInvitations,
            deadlineReminders: userPreferences.deadlineReminders,
            marketingEmails: userPreferences.marketingEmails,
            accountNotifications: userPreferences.accountNotifications
          });
        }
      } catch (error) {
        console.error("Error loading email preferences:", error);
        toast.error("Could not load your email preferences");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadPreferences();
    }
  }, [user]);

  // Handle toggle preference change
  const handleToggle = (preference) => {
    setPreferences(prev => ({
      ...prev,
      [preference]: !prev[preference]
    }));
  };

  // Save preferences
  const handleSave = async () => {
    try {
      setSaving(true);
      
      if (preferenceId) {
        // Update existing preferences
        await updateEmailPreferences(preferenceId, preferences);
      } else {
        // Create new preferences
        const newPrefs = await createEmailPreferences(user.Id, preferences);
        setPreferenceId(newPrefs.Id);
      }
      
      setOriginalPreferences({...preferences});
      toast.success("Email preferences saved successfully");
    } catch (error) {
      console.error("Error saving email preferences:", error);
      toast.error("Failed to save email preferences");
    } finally {
      setSaving(false);
    }
  };

  // Reset preferences to last saved state
  const handleReset = () => {
    if (originalPreferences) {
      setPreferences({...originalPreferences});
    }
  };

  // Check if preferences have changed
  const hasChanges = () => {
    if (!originalPreferences) return true;
    
    return Object.keys(preferences).some(key => 
      preferences[key] !== originalPreferences[key]
    );
  };

  // Icons
  const BellIcon = getIcon('bell');
  const MailIcon = getIcon('mail');
  const BriefcaseIcon = getIcon('briefcase');
  const CalendarIcon = getIcon('calendar');
  const ClockIcon = getIcon('clock');
  const UserIcon = getIcon('user');

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white dark:bg-surface-800 rounded-lg shadow p-6">
          <h1 className="text-2xl font-semibold mb-4">Email Preferences</h1>
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-surface-100 dark:bg-surface-700 rounded"></div>
            <div className="h-10 bg-surface-100 dark:bg-surface-700 rounded"></div>
            <div className="h-10 bg-surface-100 dark:bg-surface-700 rounded"></div>
            <div className="h-10 bg-surface-100 dark:bg-surface-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white dark:bg-surface-800 rounded-lg shadow p-6">
        <h1 className="text-2xl font-semibold mb-4">Email Preferences</h1>
        <p className="text-surface-600 dark:text-surface-400 mb-6">
          Manage the types of emails you receive from CareerCompass
        </p>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <BriefcaseIcon className="h-5 w-5 text-primary mr-2" />
              <span>Application Updates</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={preferences.applicationUpdates} onChange={() => handleToggle('applicationUpdates')} className="sr-only peer" />
              <div className="w-11 h-6 bg-surface-200 peer-focus:outline-none rounded-full peer dark:bg-surface-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-surface-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-surface-600 peer-checked:bg-primary"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <BriefcaseIcon className="h-5 w-5 text-primary mr-2" />
              <span>Job Recommendations</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={preferences.jobRecommendations} onChange={() => handleToggle('jobRecommendations')} className="sr-only peer" />
              <div className="w-11 h-6 bg-surface-200 peer-focus:outline-none rounded-full peer dark:bg-surface-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-surface-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-surface-600 peer-checked:bg-primary"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CalendarIcon className="h-5 w-5 text-primary mr-2" />
              <span>Interview Invitations</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={preferences.interviewInvitations} onChange={() => handleToggle('interviewInvitations')} className="sr-only peer" />
              <div className="w-11 h-6 bg-surface-200 peer-focus:outline-none rounded-full peer dark:bg-surface-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-surface-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-surface-600 peer-checked:bg-primary"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <ClockIcon className="h-5 w-5 text-primary mr-2" />
              <span>Deadline Reminders</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={preferences.deadlineReminders} onChange={() => handleToggle('deadlineReminders')} className="sr-only peer" />
              <div className="w-11 h-6 bg-surface-200 peer-focus:outline-none rounded-full peer dark:bg-surface-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-surface-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-surface-600 peer-checked:bg-primary"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <MailIcon className="h-5 w-5 text-primary mr-2" />
              <span>Marketing Emails</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={preferences.marketingEmails} onChange={() => handleToggle('marketingEmails')} className="sr-only peer" />
              <div className="w-11 h-6 bg-surface-200 peer-focus:outline-none rounded-full peer dark:bg-surface-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-surface-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-surface-600 peer-checked:bg-primary"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <UserIcon className="h-5 w-5 text-primary mr-2" />
              <span>Account Notifications</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={preferences.accountNotifications} onChange={() => handleToggle('accountNotifications')} className="sr-only peer" />
              <div className="w-11 h-6 bg-surface-200 peer-focus:outline-none rounded-full peer dark:bg-surface-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-surface-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-surface-600 peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>
        
        <div className="mt-8 flex justify-end space-x-4">
          <button 
            onClick={handleReset}
            disabled={!hasChanges() || saving}
            className="px-4 py-2 border border-surface-300 dark:border-surface-600 rounded-md text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={!hasChanges() || saving}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {saving ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailPreferences;