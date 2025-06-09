import React, { useState } from 'react';
import {
  ArrowLeft, Star, Clock, User, BookOpen, ChevronDown, ChevronUp, Menu, X
} from 'lucide-react';
import Sidebar from '../../components/student/Sidebar';
import { useNavigate, useParams } from 'react-router';
import useCourseStore from '../../zustand/currentCourse';
import useAuthStore from '../../zustand/authStore'; // ✅ import auth store
import useEnrollStore from '../../zustand/enrollCourse';
import { useSidebarStore } from '../../zustand/useSidebarStore';

const ShowCourse = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { enrollCourse, loading, error } = useEnrollStore();
  const course = useCourseStore((state) => state.selectedCourse);
  const user = useAuthStore((state) => state.user); // ✅ access user
  const { activeTab, setActiveTab } = useSidebarStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleEnroll = async () => {
    const result = await enrollCourse(id, course.price, user);
    if (result) {
      navigate('/dashboard');
      setActiveTab('dashboard');
    }
  };

  // ✅ check if the user is enrolled
  const isEnrolled = user?.enrolledCourses?.includes(id);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFDF6' }}>
      {/* Header - Fixed to account for sidebar on large screens */}
      <header className="sticky top-0 z-50 px-4 py-4 border-b shadow-sm lg:pl-72" style={{ backgroundColor: '#FAF6E9' }}>
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-white/50 transition-colors"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 rounded-lg hover:bg-white/50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="font-medium text-sm sm:text-base">Back</span>
            </button>
          </div>
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 text-center flex-1 px-2 sm:px-4 truncate">
            {course.topic}
          </h1>
          <div className="w-16 sm:w-20"></div>
        </div>
      </header>

      <div className="flex max-w-7xl mx-auto">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          className="fixed lg:sticky top-16 left-0 z-40"
        />

        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}

        {/* Main content with proper margin for sidebar */}
        <main className="flex-1 p-2 sm:p-4 lg:p-8 lg:ml-0">
          <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 lg:space-y-8">
            <div className="w-full h-40 sm:h-48 md:h-64 lg:h-80 rounded-xl sm:rounded-2xl overflow-hidden shadow-lg">
              <img
                src={course.image}
                alt={course.topic}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm" style={{ backgroundColor: '#FAF6E9' }}>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">Course Overview</h2>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{course.description}</p>
                </div>

                <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm" style={{ backgroundColor: '#FAF6E9' }}>
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => toggleSection('skills')}
                  >
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Skills You'll Learn</h3>
                    {expandedSection === 'skills' ? <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" /> : <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />}
                  </div>
                  {expandedSection === 'skills' && (
                    <div className="mt-3 sm:mt-4 flex flex-wrap gap-2">
                      {course.skills && course.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium text-gray-700 capitalize"
                          style={{ backgroundColor: '#DDEB9D' }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* ✅ Conditional Button */}
                <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm" style={{ backgroundColor: '#FAF6E9' }}>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Course Content</h3>
                  <button
                    className="w-full py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg sm:rounded-xl font-semibold text-white transition-all duration-300 hover:shadow-lg hover:scale-105 flex items-center justify-center space-x-2 text-sm sm:text-base"
                    style={{ backgroundColor: '#A0C878' }}
                    onClick={() => navigate(`/course/${id}/viewCourse`)}
                  >
                    <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>{isEnrolled ? 'Continue Learning' : 'View Course Content'}</span>
                  </button>
                </div>
              </div>

              <div className="space-y-4 sm:space-y-6">
                {!isEnrolled && (
                  <div className="space-y-4 sm:space-y-6">
                    <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm sticky top-24" style={{ backgroundColor: '#FAF6E9' }}>
                      <div className="text-center space-y-3 sm:space-y-4">
                        <div className="text-2xl sm:text-3xl font-bold text-gray-800">₹{course.price}</div>
                        <button
                          onClick={handleEnroll}
                          className="w-full py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg sm:rounded-xl font-semibold text-white transition-all duration-300 hover:shadow-lg hover:scale-105 text-sm sm:text-base"
                          style={{ backgroundColor: '#A0C878' }}
                        >
                          Enroll Now
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm space-y-3 sm:space-y-4" style={{ backgroundColor: '#FAF6E9' }}>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800">Course Details</h3>

                  <div className="flex items-center space-x-3">
                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs sm:text-sm text-gray-500">Instructor</div>
                      <div className="font-medium text-gray-800 text-sm sm:text-base truncate">{course.tutor}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs sm:text-sm text-gray-500">Duration</div>
                      <div className="font-medium text-gray-800 text-sm sm:text-base">{course.hours} hours</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs sm:text-sm text-gray-500">Lessons</div>
                      <div className="font-medium text-gray-800 text-sm sm:text-base">
                        {course.lessons?.length || 0} chapters
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ShowCourse;  