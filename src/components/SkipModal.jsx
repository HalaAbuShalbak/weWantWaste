import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const SkipModal = ({ skip, gross, onClose, onCheckout }) => {
  const modalRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    // Add event listener when modal is mounted
    document.addEventListener('mousedown', handleClickOutside);

    // Clean up event listener when modal is unmounted
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handleCheckout = () => {
    // Navigate to checkout page with skip data
    navigate('/checkout', { state: { skip, gross } });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div ref={modalRef} className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full transform transition-all">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Skip Details</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-300">Size:</span>
            <span className="font-semibold text-gray-900 dark:text-white">{skip.size} Yards</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-300">Price:</span>
            <span className="font-semibold text-gray-900 dark:text-white">£{gross.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-300">Hire Period:</span>
            <span className="font-semibold text-gray-900 dark:text-white">{skip.hire_period_days} days</span>
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-300 italic">
              Imagery and information shown throughout this website may not reflect the exact shape or size specification, colours may vary, options and/or accessories may be featured at additional cost.
            </p>
          </div>
          
          <button
            onClick={handleCheckout}
            className="w-full mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold text-base hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default SkipModal; 