import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

// Inline SVG used to represent a warning icon, avoiding external dependency conflicts
const WarningIconSVG = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" x2="12" y1="8" y2="12" />
    <line x1="12" x2="12.01" y1="16" y2="16" />
  </svg>
);

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Helmet>
        <title>404 Error - Assignment Not Found</title>
      </Helmet>
      
      {/* Main Card: Uses clean, modern styling for an 'assignment'/'dashboard' look */}
      <div className="text-center w-full max-w-lg p-10 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl transition duration-500 ease-in-out transform hover:scale-[1.01] border-t-4 border-indigo-600">
        
        {/* Icon and Main Error Code */}
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mb-4 border-4 border-indigo-500/30">
            <WarningIconSVG className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h1 className="text-9xl font-extrabold text-gray-900 dark:text-white transition duration-300">404</h1>
        </div>
        
        {/* Title and Subtitle */}
        <h2 className="text-3xl md:text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-3 tracking-tight">
          Resource Not Found
        </h2>
        
        <p className="text-base text-gray-600 dark:text-gray-400 mb-8">
          Sorry, the requested page could not be located on the server. Please check the URL for errors.
        </p>
        
        {/* Action Button: Styled with hover and shadow effects */}
        <Link 
          to="/" 
          className="inline-flex items-center justify-center px-8 py-3 bg-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:bg-indigo-700 transition duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-indigo-500/50"
        >
          {/* Arrow Left Icon */}
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Back to Home Page
        </Link>
        
        <p className="mt-8 text-sm text-gray-400 dark:text-gray-500">
          If you believe this is an error, please contact the administrator.
        </p>
      </div>
    </div>
  );
};

export default NotFound;