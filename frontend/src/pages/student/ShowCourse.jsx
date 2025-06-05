import React, { useState } from 'react';
import { ArrowLeft, Star, Clock, User, BookOpen, ChevronDown, ChevronUp, Menu, X } from 'lucide-react';
import Sidebar from '../../components/student/Sidebar'; // Import your custom sidebar component
import { useNavigate, useParams } from 'react-router';


const CourseDetailsPage = () => {
  const navigate = useNavigate();
  const {id}=useParams();


  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);

  const course = useCourseStore(state => state.currentCourse);
  if (!course) return <p>Loading or no course selected.</p>;

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<Star key="half" className="w-4 h-4 fill-yellow-400 text-yellow-400 opacity-50" />);
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
    }
    
    return stars;
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFDF6' }}>
      {/* Header */}
      <header className="sticky top-0 z-50 px-4 py-4 border-b shadow-sm" style={{ backgroundColor: '#FAF6E9' }}>
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <button 
              className="lg:hidden p-2 rounded-lg hover:bg-white/50 transition-colors"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <button className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-white/50 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </button>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 text-center flex-1">
            {course.topic}
          </h1>
          {/* Empty spacer for layout balance */}
          <div className="w-20 lg:w-auto"></div>
        </div>
      </header>

      <div className="flex max-w-7xl mx-auto">
        {/* Custom Sidebar Component */}
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
          className="fixed lg:sticky top-16 left-0 z-40"
        />

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Course Image */}
            <div className="w-full h-48 md:h-64 lg:h-80 rounded-2xl overflow-hidden shadow-lg">
              <img 
                src={course.image} 
                alt={course.topic}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Course Info Grid */}
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column - Main Info */}
              <div className="lg:col-span-2 space-y-6">
                {/* Course Overview */}
                <div className="p-6 rounded-2xl shadow-sm" style={{ backgroundColor: '#FAF6E9' }}>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Course Overview</h2>
                  <p className="text-gray-600 leading-relaxed">{course.description}</p>
                </div>

                {/* Skills Section */}
                <div className="p-6 rounded-2xl shadow-sm" style={{ backgroundColor: '#FAF6E9' }}>
                  <div 
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => toggleSection('skills')}
                  >
                    <h3 className="text-xl font-semibold text-gray-800">Skills You'll Learn</h3>
                    {expandedSection === 'skills' ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                  {expandedSection === 'skills' && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {course.skills && course.skills.map((skill, index) => (
                        <span 
                          key={index}
                          className="px-4 py-2 rounded-full text-sm font-medium text-gray-700 capitalize"
                          style={{ backgroundColor: '#DDEB9D' }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Course Content Button */}
                <div className="p-6 rounded-2xl shadow-sm" style={{ backgroundColor: '#FAF6E9' }}>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Course Content</h3>
                  <button 
                    className="w-full py-3 px-6 rounded-xl font-semibold text-white transition-all duration-300 hover:shadow-lg hover:scale-105 flex items-center justify-center space-x-2"
                    style={{ backgroundColor: '#A0C878' }}
                    onClick={() => {
                      // Add your navigation logic here
                      navigate(`/course/${id}/viewCourse`)
                    }}
                  >
                    <BookOpen className="w-5 h-5" />
                    <span>View Course Content</span>
                  </button>
                </div>
              </div>

              {/* Right Column - Course Details */}
              <div className="space-y-6">
                {/* Price & Enroll */}
                <div className="p-6 rounded-2xl shadow-sm sticky top-24" style={{ backgroundColor: '#FAF6E9' }}>
                  <div className="text-center space-y-4">
                    <div className="text-3xl font-bold text-gray-800">{course.price}</div>
                    <button 
                      className="w-full py-3 px-6 rounded-xl font-semibold text-white transition-all duration-300 hover:shadow-lg hover:scale-105"
                      style={{ backgroundColor: '#A0C878' }}
                    >
                      Enroll Now
                    </button>
                  </div>
                </div>

                {/* Course Stats */}
                <div className="p-6 rounded-2xl shadow-sm space-y-4" style={{ backgroundColor: '#FAF6E9' }}>
                  <h3 className="text-lg font-semibold text-gray-800">Course Details</h3>
                  
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-gray-600" />
                    <div>
                      <div className="text-sm text-gray-500">Instructor</div>
                      <div className="font-medium text-gray-800">{course.tutor}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-gray-600" />
                    <div>
                      <div className="text-sm text-gray-500">Duration</div>
                      <div className="font-medium text-gray-800">{course.hours} hours</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      {renderStars(parseFloat(course.rating))}
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Rating</div>
                      <div className="font-medium text-gray-800">{course.rating}/5</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <BookOpen className="w-5 h-5 text-gray-600" />
                    <div>
                      <div className="text-sm text-gray-500">Lessons</div>
                      <div className="font-medium text-gray-800">
                        {course.lessons && Array.isArray(course.lessons) ? course.lessons.length : 0} chapters
                      </div>
                    </div>
                  </div>

                  {/* Course Details Button */}
                  
                  
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CourseDetailsPage;