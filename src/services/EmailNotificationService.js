import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { 
  welcomeEmailTemplate, 
  applicationConfirmationTemplate,
  statusUpdateTemplate,
  interviewInvitationTemplate,
  deadlineReminderTemplate
} from '../utils/emailTemplates';

/**
 * Mock email sending function for development/demo purposes
 * In production, this would be replaced with actual email service integration
 * @param {Object} emailData - The email data including to, subject, and html content
 * @returns {Promise} - A promise that resolves when the email is "sent"
 */
const mockSendEmail = async (emailData) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  console.log('EMAIL WOULD BE SENT:', {
    to: emailData.to,
    from: import.meta.env.VITE_EMAIL_FROM || 'CareerCompass <notifications@careercompass.io>',
    subject: emailData.subject,
    html: emailData.html.slice(0, 150) + '...' // Log just the beginning for brevity
  });
  
  // In development, show a toast notification instead of actually sending
  // This makes the feature demonstrable without actual email sending
  toast.info(`Email notification: "${emailData.subject}" would be sent to ${emailData.to}`);
  
  return { success: true, messageId: `mock_${Date.now()}` };
};

/**
 * Production email sending function using a service like Nodemailer
 * @param {Object} emailData - The email data including to, subject, and html content
 * @returns {Promise} - A promise that resolves when the email is sent
 */
const sendRealEmail = async (emailData) => {
  // This would be implemented with a real email service
  // For now, we just call the mock function
  return mockSendEmail(emailData);
};

/**
 * Chooses the appropriate email sending function based on environment
 * @param {Object} emailData - The email data to send
 * @returns {Promise} - A promise that resolves when the email is sent
 */
const sendEmail = async (emailData) => {
  // Check environment variables to determine which email service to use
  const emailService = import.meta.env.VITE_EMAIL_SERVICE || 'mock';
  
  try {
    if (emailService === 'mock') {
      return await mockSendEmail(emailData);
    } else {
      return await sendRealEmail(emailData);
    }
  } catch (error) {
    console.error('Failed to send email:', error);
    // We don't want to throw here to prevent disrupting the user experience
    // But we should log the error and possibly track it
    return { success: false, error: error.message };
  }
};

/**
 * Prepare templated email with personalized content
 * @param {String} template - HTML template with placeholders
 * @param {Object} data - Data to replace placeholders
 * @returns {String} - Compiled HTML email
 */
const prepareEmail = (template, data) => {
  let compiledTemplate = template;
  
  // Replace all placeholders in the template
  Object.keys(data).forEach(key => {
    const placeholder = new RegExp(`{{${key}}}`, 'g');
    compiledTemplate = compiledTemplate.replace(placeholder, data[key]);
  });
  
  return compiledTemplate;
};

/**
 * Send welcome email to new users
 * @param {Object} user - User object with email, firstName, etc.
 * @returns {Promise} - Promise that resolves when email is sent
 */
export const sendWelcomeEmail = async (user) => {
  const fullName = `${user.firstName} ${user.lastName}`;
  
  // Prepare email content
  const htmlContent = prepareEmail(welcomeEmailTemplate, {
    name: user.firstName,
    fullName,
    role: user.role,
    date: format(new Date(), 'MMMM dd, yyyy'),
    unsubscribeUrl: `https://careercompass.io/unsubscribe?email=${encodeURIComponent(user.email)}&token=mock-token`
  });
  
  // Send email
  return sendEmail({
    to: user.email,
    subject: `Welcome to CareerCompass, ${user.firstName}!`,
    html: htmlContent
  });
};

/**
 * Send job application confirmation email
 * @param {Object} user - User who applied for the job
 * @param {Object} application - Application details
 * @param {Object} job - Job details
 * @returns {Promise} - Promise that resolves when email is sent
 */
export const sendJobApplicationConfirmation = async (user, application, job) => {
  // Prepare email content
  const htmlContent = prepareEmail(applicationConfirmationTemplate, {
    name: user.firstName,
    jobTitle: job.title,
    company: job.company,
    dateApplied: format(new Date(application.dateApplied), 'MMMM dd, yyyy'),
    jobUrl: `https://careercompass.io/job/${job.id}`,
    applicationUrl: `https://careercompass.io/my-applications`,
    unsubscribeUrl: `https://careercompass.io/unsubscribe?email=${encodeURIComponent(user.email)}&token=mock-token`
  });
  
  // Send email
  return sendEmail({
    to: user.email,
    subject: `Application Submitted: ${job.title} at ${job.company}`,
    html: htmlContent
  });
};

/**
 * Send application status update email
 * @param {Object} user - User who applied for the job
 * @param {String} status - New application status
 * @param {Object} application - Application details
 * @param {Object} job - Job details
 * @param {String} notes - Optional additional notes
 * @returns {Promise} - Promise that resolves when email is sent
 */
export const sendApplicationStatusUpdate = async (user, status, application, job, notes = '') => {
  // Map status to user-friendly text and appropriate subject
  const statusMessages = {
    'Applied': { 
      subject: 'Application Received',
      heading: 'Your application has been received',
      message: 'We have received your application and will review it shortly.'
    },
    'Reviewing': { 
      subject: 'Application Under Review',
      heading: 'Your application is being reviewed',
      message: 'Your application is currently under review by the hiring team.'
    },
    'Interview': { 
      subject: 'Interview Request',
      heading: 'You\'ve been selected for an interview',
      message: 'Congratulations! The employer would like to schedule an interview with you.'
    },
    'Offer': { 
      subject: 'Job Offer Extended',
      heading: 'Congratulations! You\'ve received a job offer',
      message: 'Great news! The employer has extended a job offer to you.'
    },
    'Rejected': { 
      subject: 'Application Status Update',
      heading: 'Application status update',
      message: 'We appreciate your interest, but we\'ve decided to move forward with other candidates at this time.'
    },
    'job_closed': { 
      subject: 'Job Position Closed',
      heading: 'Job position has been closed',
      message: 'The job position you applied for is no longer available.'
    }
  };
  
  const statusInfo = statusMessages[status] || {
    subject: 'Application Status Update',
    heading: 'Your application status has been updated',
    message: `Your application status has been updated to: ${status}`
  };
  
  // Prepare email content
  const htmlContent = prepareEmail(statusUpdateTemplate, {
    name: user.firstName,
    status: status,
    jobTitle: application.jobTitle || job?.title || 'the position',
    company: application.company || job?.company || 'the company',
    statusHeading: statusInfo.heading,
    statusMessage: statusInfo.message,
    notes: notes ? `<p><strong>Additional notes:</strong> ${notes}</p>` : '',
    applicationUrl: `https://careercompass.io/my-applications`,
    unsubscribeUrl: `https://careercompass.io/unsubscribe?email=${encodeURIComponent(user.email)}&token=mock-token`
  });
  
  // Send email
  return sendEmail({
    to: user.email,
    subject: statusInfo.subject,
    html: htmlContent
  });
};

/**
 * Send interview invitation email
 * @param {Object} user - User invited to interview
 * @param {Object} interview - Interview details
 * @param {Object} job - Job details
 * @param {Object} employer - Employer details
 * @returns {Promise} - Promise that resolves when email is sent
 */
export const sendInterviewInvitation = async (user, interview, job, employer) => {
  // Format date and time properly
  const formattedDate = format(new Date(interview.date), 'EEEE, MMMM dd, yyyy');
  
  // Prepare location info (virtual or physical)
  const locationInfo = interview.locationType === 'virtual' 
    ? `<p><strong>Meeting Link:</strong> <a href="${interview.location}">${interview.location}</a></p>` 
    : `<p><strong>Location:</strong> ${interview.location}</p>`;
  
  // Prepare email content
  const htmlContent = prepareEmail(interviewInvitationTemplate, {
    name: user.firstName,
    jobTitle: job.title,
    company: job.company,
    interviewDate: formattedDate,
    interviewTime: interview.time,
    interviewType: interview.type || 'Job Interview',
    locationInfo: locationInfo,
    interviewerName: `${employer.firstName} ${employer.lastName}`,
    interviewNotes: interview.notes ? `<p><strong>Additional notes:</strong> ${interview.notes}</p>` : '',
    calendarLink: '#', // In production, generate actual calendar invite links
    applicationUrl: `https://careercompass.io/my-applications`,
    unsubscribeUrl: `https://careercompass.io/unsubscribe?email=${encodeURIComponent(user.email)}&token=mock-token`
  });
  
  // Send email
  return sendEmail({
    to: user.email,
    subject: `Interview Invitation: ${job.title} at ${job.company}`,
    html: htmlContent
  });
};

/**
 * Send deadline reminder email
 * @param {Object} user - User to remind
 * @param {Object} application - Application with deadline
 * @returns {Promise} - Promise that resolves when email is sent
 */
export const sendJobDeadlineReminder = async (user, application) => {
  // Format the deadline date
  const deadlineDate = format(new Date(application.deadline), 'EEEE, MMMM dd, yyyy');
  
  // Calculate days until deadline
  const today = new Date();
  const deadline = new Date(application.deadline);
  const diffTime = deadline - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // Prepare email content
  const htmlContent = prepareEmail(deadlineReminderTemplate, {
    name: user.firstName,
    jobTitle: application.jobTitle,
    company: application.company,
    deadlineDate: deadlineDate,
    daysRemaining: diffDays,
    applicationUrl: `https://careercompass.io/my-applications`,
    unsubscribeUrl: `https://careercompass.io/unsubscribe?email=${encodeURIComponent(user.email)}&token=mock-token`
  });
  
  // Send email
  return sendEmail({
    to: user.email,
    subject: `Reminder: Application deadline for ${application.jobTitle} is approaching`,
    html: htmlContent
  });
};