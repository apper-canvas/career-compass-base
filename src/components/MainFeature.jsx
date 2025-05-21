import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';

// Mock data for applications
const mockApplications = [
  {
    id: 1,
    jobTitle: "Frontend Developer",
    company: "TechCorp",
    status: "Applied",
    dateApplied: "2023-03-10",
    notes: ""
  },
  {
    id: 2,
    jobTitle: "UX Designer",
    company: "DesignHub",
    status: "Interview",
    dateApplied: "2023-03-05",
    notes: "Interview scheduled for March 15th"
  },
  {
    id: 3,
    jobTitle: "Product Manager",
    company: "GrowthStartup",
    status: "Rejected",
    dateApplied: "2023-02-28",
    notes: "Received rejection email"
  }
];

// Status badges configuration
const statusConfig = {
  Applied: {
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    icon: "send"
  },
  Interview: {
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    icon: "calendar"
  },
  "Offer Received": {
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    icon: "check-circle"
  },
  Rejected: {
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    icon: "x-circle"
  },
  "Not Applied": {
    color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
    icon: "clock"
  }
};

const ApplicationTracker = () => {
  const [applications, setApplications] = useState(mockApplications);
  const [newApplication, setNewApplication] = useState({
    jobTitle: "",
    company: "",
    status: "Not Applied",
    dateApplied: new Date().toISOString().split('T')[0],
    notes: ""
  });
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Add or update application
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!newApplication.jobTitle || !newApplication.company) {
      toast.error("Please fill out all required fields");
      return;
    }
    
    if (editingId) {
      // Update existing application
      const updatedApplications = applications.map(app => 
        app.id === editingId ? { ...newApplication, id: editingId } : app
      );
      setApplications(updatedApplications);
      toast.success("Application updated successfully");
    } else {
      // Add new application
      const newId = Math.max(...applications.map(app => app.id), 0) + 1;
      setApplications([...applications, { ...newApplication, id: newId }]);
      toast.success("Application added successfully");
    }
    
    // Reset form
    setNewApplication({
      jobTitle: "",
      company: "",
      status: "Not Applied",
      dateApplied: new Date().toISOString().split('T')[0],
      notes: ""
    });
    setShowForm(false);
    setEditingId(null);
  };
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewApplication({
      ...newApplication,
      [name]: value
    });
  };
  
  // Edit an application
  const handleEdit = (application) => {
    setNewApplication(application);
    setEditingId(application.id);
    setShowForm(true);
  };
  
  // Delete an application
  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this application?");
    if (confirmDelete) {
      setApplications(applications.filter(app => app.id !== id));
      toast.success("Application deleted successfully");
    }
  };
  
  // Icons
  const PlusIcon = getIcon('plus');
  const XIcon = getIcon('x');
  const EditIcon = getIcon('edit-2');
  const TrashIcon = getIcon('trash-2');
  const BriefcaseIcon = getIcon('briefcase');
  const BuildingIcon = getIcon('building');
  const CalendarIcon = getIcon('calendar');
  const ClipboardListIcon = getIcon('clipboard-list');
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="card overflow-hidden border border-surface-200 dark:border-surface-700">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">Application Tracker</h3>
          
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
              setNewApplication({
                jobTitle: "",
                company: "",
                status: "Not Applied",
                dateApplied: new Date().toISOString().split('T')[0],
                notes: ""
              });
            }}
            className="btn btn-primary inline-flex items-center"
          >
            {showForm ? (
              <>
                <XIcon className="h-4 w-4 mr-2" /> 
                Cancel
              </>
            ) : (
              <>
                <PlusIcon className="h-4 w-4 mr-2" /> 
                Add Application
              </>
            )}
          </button>
        </div>
        
        {/* Add/Edit Application Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 p-4 bg-surface-50 dark:bg-surface-800 rounded-lg border border-surface-200 dark:border-surface-700"
          >
            <h4 className="text-lg font-medium mb-4">
              {editingId ? "Edit Application" : "Add New Application"}
            </h4>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="jobTitle" className="block text-sm font-medium mb-1">
                    Job Title *
                  </label>
                  <div className="relative">
                    <BriefcaseIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400 h-4 w-4" />
                    <input
                      type="text"
                      id="jobTitle"
                      name="jobTitle"
                      value={newApplication.jobTitle}
                      onChange={handleChange}
                      placeholder="e.g., Frontend Developer"
                      className="input-field pl-9"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="company" className="block text-sm font-medium mb-1">
                    Company *
                  </label>
                  <div className="relative">
                    <BuildingIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400 h-4 w-4" />
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={newApplication.company}
                      onChange={handleChange}
                      placeholder="e.g., TechCorp"
                      className="input-field pl-9"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="status" className="block text-sm font-medium mb-1">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={newApplication.status}
                    onChange={handleChange}
                    className="select-field"
                  >
                    {Object.keys(statusConfig).map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="dateApplied" className="block text-sm font-medium mb-1">
                    Date Applied
                  </label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400 h-4 w-4" />
                    <input
                      type="date"
                      id="dateApplied"
                      name="dateApplied"
                      value={newApplication.dateApplied}
                      onChange={handleChange}
                      className="input-field pl-9"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="notes" className="block text-sm font-medium mb-1">
                  Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={newApplication.notes}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Add any notes or reminders about this application..."
                  className="input-field"
                ></textarea>
              </div>
              
              <div className="flex justify-end">
                <button type="submit" className="btn btn-primary">
                  {editingId ? "Update Application" : "Add Application"}
                </button>
              </div>
            </form>
          </motion.div>
        )}
        
        {/* Applications List */}
        {applications.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300">
                <tr>
                  <th className="px-4 py-3 text-sm font-medium">Job</th>
                  <th className="px-4 py-3 text-sm font-medium">Company</th>
                  <th className="px-4 py-3 text-sm font-medium">Status</th>
                  <th className="px-4 py-3 text-sm font-medium">Date Applied</th>
                  <th className="px-4 py-3 text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-200 dark:divide-surface-700">
                {applications.map(app => (
                  <motion.tr 
                    key={app.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="hover:bg-surface-50 dark:hover:bg-surface-800"
                  >
                    <td className="px-4 py-3 font-medium">{app.jobTitle}</td>
                    <td className="px-4 py-3">{app.company}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig[app.status].color}`}>
                        {(() => {
                          const StatusIcon = getIcon(statusConfig[app.status].icon);
                          return <StatusIcon className="h-3.5 w-3.5 mr-1" />;
                        })()}
                        {app.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">{app.dateApplied}</td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(app)}
                          className="p-1.5 text-surface-600 hover:text-primary dark:text-surface-400 dark:hover:text-primary-light rounded-lg"
                          title="Edit application"
                        >
                          <EditIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(app.id)}
                          className="p-1.5 text-surface-600 hover:text-accent dark:text-surface-400 dark:hover:text-accent rounded-lg"
                          title="Delete application"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-10">
            <div className="flex justify-center mb-4">
              <ClipboardListIcon className="h-10 w-10 text-surface-400" />
            </div>
            <h4 className="text-lg font-medium mb-2">No applications yet</h4>
            <p className="text-surface-600 dark:text-surface-400 mb-4">
              Start tracking your job applications to stay organized
            </p>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="btn btn-primary"
              >
                <PlusIcon className="h-4 w-4 mr-2" /> 
                Add Your First Application
              </button>
            )}
          </div>
        )}
      </div>
      
      {/* Quick Tips */}
      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <h4 className="text-blue-800 dark:text-blue-300 font-medium mb-2">
          Quick Tips
        </h4>
        <ul className="text-blue-700 dark:text-blue-300 text-sm space-y-1">
          <li>• Keep your application tracker updated to never miss a follow-up</li>
          <li>• Add detailed notes after interviews to review later</li>
          <li>• Set reminders for follow-up emails and thank you notes</li>
        </ul>
      </div>
    </div>
  );
};

const MainFeature = () => {
  return <ApplicationTracker />;
};

export default MainFeature;