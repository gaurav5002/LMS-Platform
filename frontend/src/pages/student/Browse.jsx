import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/student/Sidebar';
import CourseGrid from '../../components/student/CourseGrid';
import { BookOpen, Clock, Users, GraduationCap } from 'lucide-react';
import axios from "axios";
import useAuthStore from '../../zustand/authStore';

const Browse = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const user = useAuthStore((state) => state.user);
  console.log(user);
  let unEnrolledCourses = []
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    try {
      
      const response = await axios.post(
        `${import.meta.env.VITE_API_USER_URL}/getAllCourses`,
        {},
        {
          withCredentials: true, 
        }
      );

      const enrolledCourses = user?.courses || [];

      unEnrolledCourses = response.data.courses.filter(
        course => !enrolledCourses.includes(course._id)
      );
      //console.log(unEnrolledCourses)

    } catch (error) {
      console.error("Failed to fetch courses", error);
    } finally {
      setLoading(false);
    }
  };

  //dummy testing

  // unEnrolledCourses = [{
  //   image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=200&fit=crop",
  //   topic: "Introduction to Nodejs",
  //   hours: "12",
  //   description: "Intro to React is a beginner-friendly course that teaches the fundamentals of building user interfaces using React, a powerful JavaScript library. You'll learn about components, props, state, and hooks, and how to create interactive, reusable UI elements. Ideal for front-end developers looking to build fast, responsive web apps with clean and modular code.",
  //   price: "200$",
  //   tutor: "Gaurav",
  //   skills: ["react", "frontend development", "web development"],
  //   lessons: ["Chapter 1", "Chapter 2", "Chapter 3", "Chapter 4"],
  //   rating: "4.1",
  //   id: "55",
  //   progress: -1 // New progress prop with default value

  // }]

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Modern LMS Loading Component
  const LoadingScreen = () => (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FAF6E9' }}>
      <div className="text-center max-w-md mx-auto px-6">
        {/* Animated Logo/Icon */}
        <div className="relative mb-8">
          <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 animate-pulse"
            style={{ backgroundColor: '#A0C878' }}>
            <GraduationCap size={40} className="text-white" />
          </div>

          {/* Floating Learning Icons */}
          <div className="absolute -top-2 -left-2 animate-bounce" style={{ animationDelay: '0.5s' }}>
            <div className="w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center">
              <BookOpen size={16} style={{ color: '#A0C878' }} />
            </div>
          </div>

          <div className="absolute -top-2 -right-2 animate-bounce" style={{ animationDelay: '1s' }}>
            <div className="w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center">
              <Clock size={16} style={{ color: '#A0C878' }} />
            </div>
          </div>

          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 animate-bounce" style={{ animationDelay: '1.5s' }}>
            <div className="w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center">
              <Users size={16} style={{ color: '#A0C878' }} />
            </div>
          </div>
        </div>

        {/* Loading Text */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading Courses</h2>
          <p className="text-gray-600">Discovering amazing learning opportunities for you...</p>
        </div>

        {/* Modern Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4 overflow-hidden">
          <div className="h-full rounded-full animate-pulse"
            style={{
              background: 'linear-gradient(90deg, #A0C878 0%, #8BB968 50%, #A0C878 100%)',
              animation: 'loading-bar 2s ease-in-out infinite'
            }}>
          </div>
        </div>

        {/* Loading Steps */}
        <div className="space-y-2 text-sm text-gray-500">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Fetching course catalog</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            <span>Personalizing recommendations</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
            <span>Preparing your dashboard</span>
          </div>
        </div>

        {/* Loading Animation Keyframes */}
        <style jsx>{`
          @keyframes loading-bar {
            0% { width: 0%; }
            50% { width: 70%; }
            100% { width: 100%; }
          }
        `}</style>
      </div>
    </div>
  );

  if (loading) return <LoadingScreen />;

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
          className={`fixed inset-y-0 left-0 z-40 w-64 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
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
            <CourseGrid courses={unEnrolledCourses} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Browse;