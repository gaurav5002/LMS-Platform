import React from 'react';
import { Clock, ChevronRight } from 'lucide-react';
import CourseCard from './CourseCard';



// Responsive Course Grid Component
const CourseGrid = () => {
  const courses = [
    {
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=200&fit=crop",
      topic: "Introduction to React",
      hours: "12"
    },
    {
      image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=400&h=200&fit=crop",
      topic: "Advanced JavaScript Concepts",
      hours: "18"
    },
    {
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=200&fit=crop",
      topic: "Python for Data Science",
      hours: "25"
    },
    {
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=200&fit=crop",
      topic: "Web Development Bootcamp",
      hours: "40"
    },
    {
      image: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=400&h=200&fit=crop",
      topic: "Machine Learning Fundamentals",
      hours: "30"
    },
    {
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=200&fit=crop",
      topic: "UI/UX Design Principles",
      hours: "22"
    },
    {
      image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=200&fit=crop",
      topic: "Database Management Systems",
      hours: "16"
    },
    {
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=200&fit=crop",
      topic: "Digital Marketing Strategy",
      hours: "14"
    }
  ];

  return (
    <div 
      className="min-h-screen p-4 sm:p-6 lg:p-8"
      style={{ backgroundColor: '#FAF6E9' }}
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-6 sm:mb-8 text-center">Featured Courses</h2>
        
        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {courses.map((course, index) => (
            <CourseCard
              key={index}
              image={course.image}
              topic={course.topic}
              hours={course.hours}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseGrid;