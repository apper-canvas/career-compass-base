import { useState } from 'react';
import { motion } from 'framer-motion';
import { getIcon } from '../utils/iconUtils';

const InterviewTips = () => {
  const LightbulbIcon = getIcon('lightbulb');
  const BriefcaseIcon = getIcon('briefcase');
  const UsersIcon = getIcon('users');
  const CodeIcon = getIcon('code');
  const VideoIcon = getIcon('video');
  const PhoneIcon = getIcon('phone');
  const CheckCircleIcon = getIcon('check-circle');
  const ThumbsUpIcon = getIcon('thumbs-up');
  const ChevronDownIcon = getIcon('chevron-down');
  
  // State for accordion sections
  const [openSection, setOpenSection] = useState({
    behavioral: true,
    technical: false,
    panel: false,
    phone: false,
    video: false
  });

  const toggleSection = (section) => {
    setOpenSection(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-12">
          <LightbulbIcon className="h-16 w-16 text-primary mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Interview Tips & Strategies</h1>
          <p className="text-lg text-surface-600 dark:text-surface-300 max-w-3xl mx-auto">
            Prepare for your upcoming interviews with our comprehensive guide covering different types of interviews 
            and strategies to help you succeed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="card text-center">
            <div className="rounded-full bg-primary/10 p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <BriefcaseIcon className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Be Prepared</h3>
            <p className="text-surface-600 dark:text-surface-400">
              Research the company, understand the role, and practice your responses to common questions.
            </p>
          </div>
          
          <div className="card text-center">
            <div className="rounded-full bg-primary/10 p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <UsersIcon className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Be Professional</h3>
            <p className="text-surface-600 dark:text-surface-400">
              Dress appropriately, arrive early, and demonstrate good body language and communication skills.
            </p>
          </div>
          
          <div className="card text-center">
            <div className="rounded-full bg-primary/10 p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <ThumbsUpIcon className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Be Positive</h3>
            <p className="text-surface-600 dark:text-surface-400">
              Show enthusiasm for the role, focus on your strengths, and frame challenges as learning opportunities.
            </p>
          </div>
        </div>

        {/* Interview Types Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">Types of Interviews</h2>
          
          {/* Behavioral Interviews */}
          <div className="card mb-4">
            <div 
              className="flex justify-between items-center cursor-pointer" 
              onClick={() => toggleSection('behavioral')}
            >
              <div className="flex items-center">
                <BriefcaseIcon className="h-6 w-6 text-primary mr-3" />
                <h3 className="text-xl font-semibold">Behavioral Interviews</h3>
              </div>
              <motion.div
                animate={{ rotate: openSection.behavioral ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDownIcon className="h-5 w-5" />
              </motion.div>
            </div>
            
            {openSection.behavioral && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 pt-4 border-t border-surface-200 dark:border-surface-700"
              >
                <p className="mb-4">
                  Behavioral interviews focus on how you've handled situations in the past to predict your future performance.
                </p>
                <h4 className="font-semibold mb-2">Tips:</h4>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-primary flex-shrink-0 mt-0.5 mr-2" />
                    <span>Use the STAR method (Situation, Task, Action, Result) to structure your answers</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-primary flex-shrink-0 mt-0.5 mr-2" />
                    <span>Prepare specific examples from your work history that demonstrate key skills</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-primary flex-shrink-0 mt-0.5 mr-2" />
                    <span>Be honest and authentic, focusing on your contributions</span>
                  </li>
                </ul>
              </motion.div>
            )}
          </div>
          
          {/* Technical Interviews */}
          <div className="card mb-4">
            <div 
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleSection('technical')}
            >
              <div className="flex items-center">
                <CodeIcon className="h-6 w-6 text-primary mr-3" />
                <h3 className="text-xl font-semibold">Technical Interviews</h3>
              </div>
              <motion.div
                animate={{ rotate: openSection.technical ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDownIcon className="h-5 w-5" />
              </motion.div>
            </div>
            
            {openSection.technical && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 pt-4 border-t border-surface-200 dark:border-surface-700"
              >
                <p className="mb-4">
                  Technical interviews assess your specific technical knowledge and problem-solving abilities.
                </p>
                <h4 className="font-semibold mb-2">Tips:</h4>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-primary flex-shrink-0 mt-0.5 mr-2" />
                    <span>Practice common technical problems in your field</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-primary flex-shrink-0 mt-0.5 mr-2" />
                    <span>Explain your thought process as you solve problems</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-primary flex-shrink-0 mt-0.5 mr-2" />
                    <span>Be prepared to discuss your technical projects in detail</span>
                  </li>
                </ul>
              </motion.div>
            )}
          </div>
          
          {/* Other interview types - Panel, Phone, Video */}
          <div className="card mb-4">
            <div 
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleSection('panel')}
            >
              <div className="flex items-center">
                <UsersIcon className="h-6 w-6 text-primary mr-3" />
                <h3 className="text-xl font-semibold">Panel Interviews</h3>
              </div>
              <motion.div
                animate={{ rotate: openSection.panel ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDownIcon className="h-5 w-5" />
              </motion.div>
            </div>
            
            {openSection.panel && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 pt-4 border-t border-surface-200 dark:border-surface-700"
              >
                <p className="mb-4">
                  Panel interviews involve multiple interviewers asking questions in the same session.
                </p>
                <h4 className="font-semibold mb-2">Tips:</h4>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-primary flex-shrink-0 mt-0.5 mr-2" />
                    <span>Make eye contact with each panel member when responding</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-primary flex-shrink-0 mt-0.5 mr-2" />
                    <span>Address the specific concerns or interests of each interviewer</span>
                  </li>
                </ul>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default InterviewTips;