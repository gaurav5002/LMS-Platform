

import { ChevronRight, Clock } from "lucide-react";
import React from "react";
const CourseCard = ({ 
  image = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=200&fit=crop",
  topic = "Introduction to React",
  hours = "12"
}) => {
  return (
    <div 
      className="rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:transform hover:scale-105 w-full"
      style={{ backgroundColor: '#FFFDF6' }}
    >
      {/* Course Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={topic}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        />
        <div className="absolute top-3 right-3">
          <span 
            className="px-2 py-1 rounded-full text-xs font-medium text-white"
            style={{ backgroundColor: '#A0C878' }}
          >
            Course
          </span>
        </div>
      </div>

      {/* Course Content */}
      <div className="p-5">
        {/* Course Topic */}
        <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
          {topic}
        </h3>

        {/* Duration */}
        <div className="flex items-center mb-4">
          <Clock size={16} className="mr-2" style={{ color: '#A0C878' }} />
          <span className="text-sm text-gray-600">
            <span className="font-medium">{hours} hours</span> 
          </span>
        </div>

        {/* Show More Button */}
        <button
          className="w-full flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-all duration-200 text-white hover:shadow-md hover:transform hover:scale-105"
          style={{ backgroundColor: '#A0C878' }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#8FB066';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#A0C878';
          }}
        >
          <span>Show More</span>
          <ChevronRight size={16} className="ml-2" />
        </button>
      </div>
    </div>
  );
};
export default CourseCard