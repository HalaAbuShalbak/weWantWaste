import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import SkipSize from './components/SkipSize';
import WasteType from './components/WasteType';
import Checkout from './components/Checkout';
import NotFound from './components/NotFound';

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (localStorage.getItem('theme')) {
      return localStorage.getItem('theme') === 'dark'
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;

    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.removeItem('theme');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white transition-colors duration-300">
      {/* Toggle Button */}
      <div className="p-4 text-right">
      <button
          onClick={toggleDarkMode}
          className="text-2xl focus:outline-none"
          title="Toggle Theme"
        >
          {isDarkMode ? '🌞' : '🌙'}
        </button>
      </div>

      <Routes>
        <Route path="/" element={<SkipSize />} />
        <Route path="/waste-type" element={<WasteType />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default App;
