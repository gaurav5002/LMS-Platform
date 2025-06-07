
import React, { useState, useEffect } from 'react'
import { Menu, X, Play, FileText, HelpCircle, ChevronDown, ChevronRight, Lock, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import ContentViewer from '../../components/student/ContentViewer' // Import the ContentViewer component
import { useNavigate, useParams } from 'react-router'
import axios from 'axios'
import useCourseStore from '../../zustand/currentCourse'
import useAuthStore from '../../zustand/authStore'

const ViewCourseContent = () => {
  const navigate = useNavigate();
  const [expandedLessons, setExpandedLessons] = useState({})
  const [lessons, setLessons] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedContent, setSelectedContent] = useState(null)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const course = useCourseStore((state) => state.selectedCourse);
  const { user } = useAuthStore();

  // Check if user is enrolled in the current course
  const checkEnrollmentStatus = () => {
    if (!user?.enrolledCourses || !course?.id) {
      setIsEnrolled(false)
      return
    }
    
    const enrolled = user.enrolledCourses.some(enrolledCourse => 
      enrolledCourse.id === course.id || enrolledCourse.courseId === course.id
    )
    setIsEnrolled(enrolled)
  }

  // Fetch lessons from API
  useEffect(() => {
    const fetchData = async () => {
      if (!course?.id) return;
      setLoading(true);

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_USER_URL}/getCurrentCourse`,
          { courseId: course.id },
          { withCredentials: true }
        );
        console.log(response);
        
        // Handle different response cases based on backend
        if (response.status == 200) {
          console.log("Here");
          
          // Preview mode - ensure we have an array of lessons
          const lessonsData = Array.isArray(response.data.arrayOfLessons) 
            ? response.data.arrayOfLessons 
            : [response.data.arrayOfLessons];
          
          // Check enrollment status
          checkEnrollmentStatus();
          
          // If not enrolled, only show first lesson
          const filteredLessons = isEnrolled ? lessonsData : lessonsData.slice(0, 1);
          setLessons(filteredLessons);
          
          if (filteredLessons.length > 0 && filteredLessons[0]) {
            const firstLesson = filteredLessons[0];
            const firstContent = firstLesson.video || firstLesson.quiz || firstLesson.file;
            if (firstContent) {
              setSelectedContent({
                type: firstLesson.video ? 'video' : 
                      firstLesson.quiz ? 'quiz' : 'file',
                data: firstContent.path,
                title: firstContent.title
              });
            }
          }
        } else if (response.status === 200) {
          // Full access
          checkEnrollmentStatus();
          const filteredLessons = isEnrolled ? response.data.lessons : response.data.lessons.slice(0, 1);
          setLessons(filteredLessons);
          
        } else if (response.status === 204) {
          // No lessons available
          setLessons([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        if (error.response?.status === 403) {
          navigate('/courses');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [course?.id, user.token]);

  // Update lessons when enrollment status changes
  useEffect(() => {
    checkEnrollmentStatus();
  }, [user?.enrolledCourses, course?.id]);

  console.log(lessons)

  const handleBackButton = () =>{
    console.log("here in button");
    navigate(`/course/${course.id}`)
  }

  // Fixed toggleLessonExpansion function
  const toggleLessonExpansion = (lessonId) => {
    setExpandedLessons(prev => ({
      ...prev,
      [lessonId]: !prev[lessonId]
    }))
  }

  // Fixed handleContentClick function to pass the correct object structure
  const handleContentClick = (item, type, title) => {
    setSelectedContent({
      type: type,
      data: item,
      title: title
    })
  }

  const getContentIcon = (type) => {
    switch (type) {
      case 'video':
        return <Play size={14} className="text-blue-500" />
      case 'pdf':
      case 'file':
        return <FileText size={14} className="text-red-500" />
      case 'quiz':
        return <HelpCircle size={14} className="text-green-500" />
      default:
        return null
    }
  }

  const renderLessonContent = (lesson) => {
    const contentItems = []
    
    // Add video if exists
    if (lesson.videoUrl) {
      contentItems.push({
        type: 'video',
        title: lesson.video,
        data: lesson.videoUrl || lesson.video,
        duration: lesson.videoDuration
      })
    }
    
    // Add quiz if exists
    if (lesson.quizId) {
      contentItems.push({
        type: 'quiz',
        title: lesson.quiz,
        data: lesson.quizData || lesson.quiz
      })
    }
    
    // Add PDF if exists
    if (lesson.notesUrl) {
      contentItems.push({
        type: 'file',
        title: lesson.pdf,
        data: lesson.pdfUrl || lesson.pdf
      })
    }

    // Handle content array if it exists (for more flexible lesson structure)
    if (lesson.content && Array.isArray(lesson.content)) {
      contentItems.push(...lesson.content)
    }

    return contentItems
  }

  // Lock Screen Component
  const LockScreen = () => (
    <div className="flex items-center justify-center h-full">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg border-2 border-gray-200 max-w-md mx-4">
        <div className="mb-6">
          <Lock size={64} className="text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2" style={{ color: '#2E4057' }}>
            Course Locked
          </h2>
          <p className="text-lg opacity-70 mb-6" style={{ color: '#2E4057' }}>
            Enroll to access the full course content
          </p>
        </div>
        <div className="space-y-4">
          <p className="text-sm opacity-60" style={{ color: '#2E4057' }}>
            You can only view the first lesson as a preview. 
            To unlock all lessons and course materials, please enroll in this course.
          </p>
          <button 
            className="w-full bg-[#A0C878] hover:cursor-pointer text-white py-2 px-4 rounded-lg transition-colors"
            onClick={() => {
              // Navigate to enrollment page or show enrollment modal
              // You can implement this based on your app's flow
              console.log('Navigate to enrollment');
            }}
          >
            Enroll Now
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFDF6' }}>
      {/* Blurred Overlay */}
       

      {/* Header with menu button */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between px-3 sm:px-4 py-3">
          <div className="flex items-center">
            <button
              onClick={handleBackButton}
              className="p-1.5 sm:p-2 rounded-md hover:bg-gray-100 transition-colors mr-3 sm:mr-4"
            >
              <ArrowLeft size={20} className="text-gray-600 sm:w-6 sm:h-6" />
            </button>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold" style={{ color: '#2E4057' }}>
              View Course Content
            </h1>
          </div>
          
          {/* Enrollment Status Indicator */}
          <div className="flex items-center gap-2">
            {isEnrolled ? (
              <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full">
                Enrolled
              </span>
            ) : (
              <span className="text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
                Preview Mode
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Main content with lesson sidebar and content area */}
      <div className="flex flex-1 min-h-screen">
        {/* Left Lesson Sidebar */}
        <div className="w-80 bg-white border-r shadow-sm overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold" style={{ color: '#2E4057' }}>
                Course Lessons
              </h2>
              {!isEnrolled && (
                <Lock size={20} className="text-gray-400" />
              )}
            </div>
            
            {/* Enrollment Warning for Non-enrolled Users */}
            {!isEnrolled && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <Lock size={16} className="inline mr-2" />
                  Only first lesson available in preview mode
                </p>
              </div>
            )}
            
            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center p-8">
                <div className="text-sm" style={{ color: '#2E4057' }}>Loading lessons...</div>
              </div>
            )}

            {/* Empty State */}
            {!loading && lessons?.length === 0 && (
              <div className="flex items-center justify-center p-8">
                <div className="text-sm opacity-70" style={{ color: '#2E4057' }}>No lessons available</div>
              </div>
            )}
            
            {/* Lessons List */}
            {!loading && lessons.length > 0 && (
              <div className="space-y-2">
                {lessons.map((lesson, index) => {
                  const contentItems = renderLessonContent(lesson)
                  // Use a more unique key - combine lesson.id with index as fallback
                  const lessonKey = lesson.id || `lesson-${index}`
                  
                  return (
                    <div key={lessonKey} className="border rounded-lg overflow-hidden" style={{ backgroundColor: '#DDEB9D' }}>
                      {/* Lesson Header */}
                      <div
                        className="p-4 cursor-pointer hover:bg-opacity-80 transition-all duration-200"
                        onClick={(e) => {
                          e.stopPropagation() // Prevent event bubbling
                          toggleLessonExpansion(lessonKey)
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-semibold" style={{ color: '#2E4057' }}>
                                Lesson {index + 1}
                              </span>
                              {expandedLessons[lessonKey] ? 
                                <ChevronDown size={16} style={{ color: '#2E4057' }} /> : 
                                <ChevronRight size={16} style={{ color: '#2E4057' }} />
                              }
                            </div>
                            <h3 className="font-bold text-sm" style={{ color: '#2E4057' }}>
                              {lesson.title || `Lesson ${index + 1} Content`}
                            </h3>
                            <div className="flex items-center gap-4 mt-2 text-xs" style={{ color: '#2E4057' }}>
                              <span>{contentItems.length} Items</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Lesson Content Dropdown */}
                      {expandedLessons[lessonKey] && (
                        <div className="border-t bg-white bg-opacity-50">
                          <div className="p-2">
                            {contentItems.map((item, itemIndex) => (
                              <button
                                key={itemIndex}
                                onClick={(e) => {
                                  e.stopPropagation() // Prevent event bubbling
                                  handleContentClick(item.data, item.type, item.title)
                                }}
                                className="w-full flex items-center gap-3 p-2 rounded hover:bg-white hover:bg-opacity-70 transition-colors text-sm text-left"
                              >
                                {getContentIcon(item.type)}
                                <span className="flex-1" style={{ color: '#2E4057' }}>
                                  {item.title || `${item.type} content`}
                                </span>
                                {item.duration && (
                                  <span className="text-xs opacity-70" style={{ color: '#2E4057' }}>
                                    {item.duration}
                                  </span>
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
                
                {/* Locked Lessons Indicator for Non-enrolled Users */}
                {!isEnrolled && (
                  <div className="border rounded-lg overflow-hidden bg-gray-100 opacity-60">
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Lock size={16} className="text-gray-400" />
                        <div>
                          <span className="text-sm font-semibold text-gray-500">
                            More Lessons Available
                          </span>
                          <p className="text-xs text-gray-400 mt-1">
                            Enroll to unlock all course content
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 p-6">
          {selectedContent ? (
            <ContentViewer 
              selectedItem={selectedContent.data}
              selectedType={selectedContent.type}
              title={selectedContent.title}
            />
          ) : !isEnrolled ? (
            <LockScreen />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4" style={{ color: '#2E4057' }}>
                  Welcome to the Course
                </h2>
                <p className="text-lg opacity-70" style={{ color: '#2E4057' }}>
                  Click on any lesson from the sidebar to expand and view its content
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ViewCourseContent