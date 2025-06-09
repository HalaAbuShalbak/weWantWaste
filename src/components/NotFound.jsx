import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="text-center p-8">
        <h1 className="text-9xl font-bold text-blue-600 dark:text-blue-400">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mt-4">Page Not Found</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">The page you're looking for doesn't exist or has been moved.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-6 flex items-center gap-2 mx-auto text-gray-900 hover:text-black font-medium hover:bg-blue-500 rounded-full px-4 py-2 transition-colors dark:text-white"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Go Back
        </button>
      </div>
    </div>
  );
};

export default NotFound; 