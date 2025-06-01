import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import CourseGrid from '../components/CourseGrid';

const Browse = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAF6E9' }}>
      {/* Mobile Sidebar Toggle Button */}
      <div className="lg:hidden p-4">
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-gray-700 focus:outline-none"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      
      <div className="flex">
        {/* Sidebar - Fixed with higher z-index */}
        <div 
          className={`fixed inset-y-0 left-0 z-40 w-64 transform ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 lg:static transition-transform duration-300 ease-in-out bg-white shadow-lg`}
        >
          <Sidebar />
        </div>
        
        {/* Mobile Sidebar Overlay with lighter opacity */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 z-30 bg-black bg-opacity-20 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        
        {/* Main Content Area */}
        <div className="flex-1 w-full lg:w-[calc(100%-16rem)]">
          <div className="w-full p-4">
            <CourseGrid />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Browse;