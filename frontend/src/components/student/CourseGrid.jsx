import React, { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import CourseCard from './CourseCard';

const CourseGrid = ({ courses }) => {

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Filter courses based on search query
  const filteredCourses = useMemo(() => {
    if (!searchQuery.trim()) {
      return courses;
    }

    return courses.filter(course =>
      course.topic?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, courses]);

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8" style={{ backgroundColor: '#FAF6E9' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
            Discover Amazing Courses
          </h2>
          <p className="text-gray-600 text-sm sm:text-base mb-6">
            Find the perfect course to advance your skills and career
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 max-w-4xl mx-auto">
          <div className="relative">
            <div
              className={`relative bg-white rounded-2xl shadow-lg transition-all duration-300 ${isSearchFocused ? 'shadow-lg' : 'shadow-md'
                }`}
              style={{
                background: 'linear-gradient(135deg, #FFFFFF 0%, #FFFDF6 100%)',
                border: isSearchFocused ? '2px solid #A0C878' : '2px solid #DDEB9D'
              }}
            >
              <div className="flex items-center p-3 sm:p-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full mr-3" style={{ backgroundColor: '#A0C878' }}>
                  <Search className="w-5 h-5 text-white" />
                </div>

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                  placeholder="Search for courses, topics, or skills..."
                  className="flex-1 text-base text-gray-800 placeholder-gray-500 bg-transparent border-none outline-none"
                />

                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="ml-2 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                )}

                <button
                  className="ml-2 px-4 py-2 rounded-xl text-white font-semibold transition-all duration-200 hover:shadow-md transform hover:scale-102"
                  style={{ backgroundColor: '#A0C878' }}
                >
                  Search
                </button>
              </div>
            </div>

            <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full animate-pulse" style={{ backgroundColor: '#DDEB9D' }}></div>
            <div className="absolute -bottom-2 -left-2 w-4 h-4 rounded-full animate-pulse delay-1000" style={{ backgroundColor: '#A0C878' }}></div>
          </div>
        </div>

        {/* Search Results Info */}
        {searchQuery && (
          <div className="mb-6 text-center">
            <p className="text-gray-600">
              {filteredCourses.length === 0 ? (
                <span className="text-red-500">No courses found for "{searchQuery}"</span>
              ) : (
                <span>
                  Found <span className="font-semibold text-green-600">{filteredCourses.length}</span> course{filteredCourses.length !== 1 ? 's' : ''}
                  {searchQuery && <span> for "<span className="font-semibold" style={{ color: '#A0C878' }}>{searchQuery}</span>"</span>}
                </span>
              )}
            </p>
          </div>
        )}

        {/* No Courses Available (when not searching) */}
        {!searchQuery && courses.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#DDEB9D' }}>
              <X className="w-10 h-10" style={{ color: '#A0C878' }} />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No courses available</h3>
            <p className="text-gray-600">Check back later for new courses or contact support.</p>
          </div>
        )}

        {/* Course Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {filteredCourses.map((course, index) => (
              <CourseCard
                key={course.id || index}
                id={course.id}
                image={course.image}
                topic={course.topic}
                hours={course.hours}
                description={course.description}
                rating={course.rating}
                lessons={course.lessons}
                price={course.price}
                tutor={course.tutor}
                skills={course.skills}
                progress={course.progress}
              />
            ))}
          </div>
        ) : searchQuery ? (
          // No Results Found for search
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#DDEB9D' }}>
              <Search className="w-12 h-12" style={{ color: '#A0C878' }} />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No courses found</h3>
            <p className="text-gray-600 mb-4">Try searching with different keywords or browse our popular courses below.</p>
            <button
              onClick={clearSearch}
              className="px-6 py-3 rounded-xl text-white font-semibold transition-all duration-200 hover:shadow-md transform hover:scale-102"
              style={{ backgroundColor: '#A0C878' }}
            >
              Clear Search
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default CourseGrid;