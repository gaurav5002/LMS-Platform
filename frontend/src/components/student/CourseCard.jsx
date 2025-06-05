import { ChevronRight, Clock } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router";
import { useCurrentCourseStore } from "../../zustand/useCurrentCourseStore";

const CourseCard = ({
  image = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=200&fit=crop",
  topic = "Introduction to React",
  hours = "12",
  description = "Intro to React is a beginner-friendly course that teaches the fundamentals of building user interfaces using React, a powerful JavaScript library. You'll learn about components, props, state, and hooks, and how to create interactive, reusable UI elements. Ideal for front-end developers looking to build fast, responsive web apps with clean and modular code.",
  price = "200$",
  tutor = "Gaurav",
  skills = ["react", "frontend development", "web development"],
  lessons = ["Chapter 1", "Chapter 2", "Chapter 3", "Chapter 4"],
  rating = "4.1",
  id = "55",
  progress = 0 // New progress prop with default value

}) => {
  const setCurrentCourse = useCourseStore(state => state.setCurrentCourse);
  const navigate = useNavigate();
  
  const handleClick = () => {
    setCurrentCourse({ id, topic, image, hours, description, rating, lessons, price, tutor, skills, progress });
    navigate(`/course/${id}`);
  }

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
        <div className="flex items-center mb-2">
          <Clock size={16} className="mr-2" style={{ color: '#A0C878' }} />
          <span className="text-sm text-gray-600">
            <span className="font-medium">{hours} hours</span>
          </span>
        </div>

        {/* Progress Tracker - Only show if progress is not -1 */}
        {progress != -1 && (
          <div className="mb-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-600">Progress</span>
              <span className="font-medium text-gray-700">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${progress}%`, 
                  backgroundColor: '#A0C878' 
                }}
              ></div>
            </div>
          </div>
        )}

        {/* Show More Button */}
        <button
          onClick={handleClick}
          className="w-full flex items-center justify-center px-4 py-3 rounded-lg border text-base font-semibold transition-all duration-200 bg-[#fdfcf5] border-[#3a4c5a]/20 group hover:shadow-md hover:bg-[#A0C878]"
        >
          <span className="text-[#1f2c3c]">Show More</span>
          <span className="ml-2 p-1 rounded-sm">
            <ChevronRight size={16} className="text-[#1f2c3c]" />
          </span>
        </button>
      </div>
    </div>
  );
};

export default CourseCard;