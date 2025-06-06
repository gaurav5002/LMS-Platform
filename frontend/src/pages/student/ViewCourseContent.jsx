import React, { useEffect, useState } from 'react';
import { Play, FileText, HelpCircle, ChevronDown, ChevronRight, ArrowLeft, Check, Lock } from 'lucide-react';
import ContentViewer from '../../components/student/ContentViewer';
import { useParams, useNavigate } from 'react-router';
import axios from 'axios';
import useCourseStore from "../../zustand/currentCourse";
import { useProgressStore } from '../../zustand/progressStore';
import useAuthStore from '../../zustand/authStore';

const ViewCourseContent = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const course = useCourseStore((state) => state.selectedCourse);
    const { user } = useAuthStore();
    console.log(user, course.id);

    const {
        progress,
        fetchProgress,
        updateProgress,
        loading: progressLoading
    } = useProgressStore();

    const [expandedLessons, setExpandedLessons] = useState({});
    const [lessons, setLessons] = useState([]);
    const [selectedContent, setSelectedContent] = useState({
        type: null,
        item: null,
        title: null
    });
    const [accessLevel, setAccessLevel] = useState('none'); // 'none', 'preview', 'full'
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!course?.id) return;
            setLoading(true);

            try {
                const response = await axios.post(
                    `${import.meta.env.VITE_API_USER_URL}/getLessons`,
                    { courseId: course.id },
                    {
                        withCredentials: true // ✅ THIS IS CRUCIAL
                    }
                );

                // Handle different response cases based on backend
                if (response.status === 201) {
                    // Preview mode (only first lesson)
                    setAccessLevel('preview');
                    setLessons([response.data.lessons]);
                } else if (response.status === 200) {
                    // Full access
                    setAccessLevel('full');
                    setLessons(response.data.lessons);
                } else if (response.status === 204) {
                    // No lessons available
                    setAccessLevel('none');
                    setLessons([]);
                }
                console.log(lessons)

                // Only fetch progress if user has full access
                if (response.status === 200) {
                    await fetchProgress(course.id);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                if (error.response?.status === 403) {
                    // Course not published
                    navigate('/courses');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [course?.id, user.token]);

    const toggleLessonExpansion = (lessonId) => {
        setExpandedLessons(prev => ({
            ...prev,
            [lessonId]: !prev[lessonId]
        }));
    };

    const handleContentSelect = (type, content) => {
        if (!content) return;

        // Only update progress if user has full access
        if (accessLevel === 'full') {
            const progressVector = type === 'video' ? [0.1, 0, 0] :
                type === 'quiz' ? [0, 0, 0] :
                    [0, 0, 0.1];

            const lessonIdx = lessons.findIndex(l => l.id === content.lessonId);
            if (lessonIdx >= 0) {
                updateProgress(course.id, lessonIdx, progressVector);
            }
        }

        setSelectedContent({
            type,
            item: content.path,
            title: content.title
        });
    };

    const markLessonCompleted = async (lessonId) => {
        if (accessLevel !== 'full') return;

        const lessonIdx = lessons.findIndex(l => l.id === lessonId);
        if (lessonIdx >= 0) {
            await updateProgress(course.id, lessonIdx, [1, 1, 1]);
        }
    };

    const getContentIcon = (type) => {
        const icons = {
            video: <Play size={14} className="text-blue-500" />,
            file: <FileText size={14} className="text-red-500" />,
            quiz: <HelpCircle size={14} className="text-green-500" />
        };
        return icons[type] || null;
    };

    const getLessonProgress = (lessonIdx) => {
        return progress[course.id]?.[lessonIdx] || [0, -1, 0];
    };

    const isLessonCompleted = (lessonIdx) => {
        const [video, quiz, file] = getLessonProgress(lessonIdx);
        return video === 1 && (quiz === -1 || quiz === 1) && file === 1;
    };

    const LessonItem = ({ type, content, selected, progress, locked = false }) => {
        if (!content) return null;

        return (
            <div
                className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg transition-all duration-200 text-xs sm:text-sm ${
                    locked ? 'text-gray-400 cursor-not-allowed bg-gray-50' :
                        selected ? 'bg-blue-50 border border-blue-200 cursor-pointer shadow-sm' :
                            'hover:bg-gray-50 cursor-pointer hover:shadow-sm'
                }`}
                onClick={() => !locked && handleContentSelect(type, content)}
            >
                <div className="flex-shrink-0">
                    {locked ? <Lock size={12} className="sm:w-[14px] sm:h-[14px] text-gray-400" /> : getContentIcon(type)}
                </div>
                <span className="flex-1 font-medium truncate" style={{ color: locked ? '#9CA3AF' : '#2E4057' }}>
                    {content.title}
                </span>
                {!locked && progress === 1 && <Check size={12} className="sm:w-[14px] sm:h-[14px] text-green-500 flex-shrink-0" />}
            </div>
        );
    };

    const LessonCard = ({ lesson, index }) => {
        const [videoProgress, quizProgress, fileProgress] = accessLevel === 'full' ? getLessonProgress(index) : [0, -1, 0];
        const completed = accessLevel === 'full' ? isLessonCompleted(index) : false;
        const isExpanded = expandedLessons[lesson.id];
        const isLocked = accessLevel === 'preview' && index > 0;

        return (
            <div className="border rounded-xl overflow-hidden shadow-sm transition-all duration-200 hover:shadow-md" style={{
                backgroundColor: isLocked ? '#F9FAFB' : '#FFFFFF',
                borderColor: completed ? '#10B981' : isLocked ? '#E5E7EB' : '#E5E7EB'
            }}>
                {/* Lesson Header */}
                <div
                    className={`p-3 sm:p-4 transition-all duration-200 ${
                        isLocked ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50'
                    }`}
                    onClick={() => !isLocked && toggleLessonExpansion(lesson.id)}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 sm:gap-3 mb-2">
                                <span className="text-sm sm:text-base font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    Lesson {index + 1}
                                </span>
                                {isLocked && <Lock size={14} className="sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />}
                                {completed && <Check size={16} className="sm:w-[18px] sm:h-[18px] text-green-600 flex-shrink-0" />}
                                {!isLocked && (
                                    isExpanded ?
                                        <ChevronDown size={16} className="sm:w-[18px] sm:h-[18px] text-gray-600 flex-shrink-0" /> :
                                        <ChevronRight size={16} className="sm:w-[18px] sm:h-[18px] text-gray-600 flex-shrink-0" />
                                )}
                            </div>

                            <h3 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base truncate">{lesson.title || `Lesson ${index + 1}`}</h3>

                            {accessLevel === 'full' && (
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-xs text-gray-600">
                                    <div className="flex items-center gap-1">
                                        <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"></div>
                                        <span>Video: {Math.round(videoProgress * 100)}%</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0"></div>
                                        <span>Quiz: {quizProgress >= 0 ? `${Math.round(quizProgress * 100)}%` : 'Not taken'}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {isExpanded && !isLocked && (
                    <div className="border-t border-gray-100 bg-gray-50">
                        <div className="p-3 sm:p-4 space-y-2">
                            {lesson.video && (
                                <LessonItem
                                    type="video"
                                    content={lesson.video ? { ...lesson.video, lessonId: lesson.id } : null}
                                    selected={selectedContent.type === 'video' && selectedContent.item === lesson.video?.path}
                                    progress={videoProgress}
                                    locked={isLocked}
                                />
                            )}

                            {lesson.quiz && (
                                <LessonItem
                                    type="quiz"
                                    content={lesson.quiz ? { ...lesson.quiz, lessonId: lesson.id } : null}
                                    selected={selectedContent.type === 'quiz' && selectedContent.item === lesson.quiz?.path}
                                    progress={quizProgress}
                                    locked={isLocked}
                                />
                            )}

                            {lesson.file && (
                                <LessonItem
                                    type="file"
                                    content={lesson.file ? { ...lesson.file, lessonId: lesson.id } : null}
                                    selected={selectedContent.type === 'file' && selectedContent.item === lesson.file?.path}
                                    progress={fileProgress}
                                    locked={isLocked}
                                />
                            )}

                            {accessLevel === 'full' && (
                                <div className="mt-3 sm:mt-4 pt-2 border-t border-gray-200">
                                    <button
                                        onClick={() => markLessonCompleted(lesson.id)}
                                        className={`w-full py-2 sm:py-3 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 ${
                                            completed 
                                                ? 'bg-green-500 text-white shadow-sm' 
                                                : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-green-400 hover:text-green-600 hover:shadow-sm'
                                        }`}
                                    >
                                        {completed ? '✓ Completed' : 'Mark as Completed'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <div className="text-gray-600 font-medium">Loading course content...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
            {/* Enhanced Navbar */}
            <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
                <div className="px-4 sm:px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
                            <button 
                                onClick={() => navigate(`/course/${course.id}`)}
                                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all duration-200 text-gray-700 hover:text-gray-900 font-medium text-sm sm:text-base flex-shrink-0"
                            >
                                <ArrowLeft size={16} className="sm:w-[18px] sm:h-[18px]" />
                                <span className="hidden sm:inline">Back</span>
                                <span className="sm:hidden">Back</span>
                            </button>
                            
                            <div className="h-6 sm:h-8 w-px bg-gray-300 flex-shrink-0"></div>
                            
                            <div className="min-w-0 flex-1">
                                <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent truncate">
                                    {course?.title || 'Course Content'}
                                </h1>
                                <p className="text-xs sm:text-sm text-gray-600 mt-1 hidden sm:block">
                                    {accessLevel === 'preview' ? 'Preview Mode' : 
                                     accessLevel === 'full' ? 'Full Access' : 'Learning Dashboard'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 flex-shrink-0">
                            {accessLevel === 'full' && (
                                <div className="text-right hidden sm:block">
                                    <div className="text-sm font-semibold text-gray-800">
                                        Progress: {Math.round((Object.values(progress[course?.id] || {}).filter(p => p[0] === 1).length / Math.max(lessons.length, 1)) * 100)}%
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {Object.values(progress[course?.id] || {}).filter(p => p[0] === 1).length} / {lessons.length} lessons
                                    </div>
                                </div>
                            )}
                            {accessLevel === 'full' && (
                                <div className="sm:hidden">
                                    <div className="text-xs font-semibold text-gray-800">
                                        {Math.round((Object.values(progress[course?.id] || {}).filter(p => p[0] === 1).length / Math.max(lessons.length, 1)) * 100)}%
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            <div className="flex flex-col lg:flex-row flex-1 min-h-[calc(100vh-80px)]">
                {/* Enhanced Left Sidebar */}
                <div className="w-full lg:w-96 bg-white border-b lg:border-b-0 lg:border-r border-gray-200 shadow-sm overflow-y-auto max-h-[50vh] lg:max-h-none">
                    <div className="p-4 sm:p-6">
                        <div className="flex items-center justify-between mb-4 sm:mb-6">
                            <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                                Course Lessons
                            </h2>
                            {accessLevel === 'preview' && (
                                <span className="px-2 sm:px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                                    Preview
                                </span>
                            )}
                        </div>

                        {lessons.length === 0 ? (
                            <div className="text-center py-8 sm:py-12">
                                <div className="text-gray-400 mb-2 text-2xl sm:text-3xl">📚</div>
                                <div className="text-gray-600 font-medium text-sm sm:text-base">No lessons available yet</div>
                                <div className="text-gray-500 text-xs sm:text-sm">Check back later for updates</div>
                            </div>
                        ) : (
                            <div className="space-y-3 sm:space-y-4">
                                {lessons.map((lesson, index) => (
                                    <LessonCard key={lesson.id || index} lesson={lesson} index={index} />
                                ))}
                            </div>
                        )}

                        {accessLevel === 'preview' && (
                            <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border border-yellow-200 shadow-sm">
                                <div className="text-center">
                                    <div className="text-xl sm:text-2xl mb-2 sm:mb-3">🔓</div>
                                    <h3 className="font-bold text-yellow-800 mb-2 text-sm sm:text-base">Unlock Full Access</h3>
                                    <p className="text-xs sm:text-sm text-yellow-700 mb-3 sm:mb-4">
                                        Enroll now to access all lessons, quizzes, and downloadable resources.
                                    </p>
                                    <button
                                        onClick={() => navigate(`/course/${course.id}/enroll`)}
                                        className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white py-2 sm:py-3 rounded-lg text-xs sm:text-sm font-bold transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                    >
                                        Enroll Now
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Centered Content Viewer */}
                <div className="flex-1 flex justify-center">
                    <div className="w-full max-w-3xl px-4 sm:px-6">
                        <ContentViewer
                            selectedType={selectedContent.type}
                            selectedItem={selectedContent.item}
                            title={selectedContent.title}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewCourseContent;