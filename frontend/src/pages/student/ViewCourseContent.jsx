import React, { useEffect, useState } from 'react';
import { Play, FileText, HelpCircle, ChevronDown, ChevronRight, ArrowLeft, Check } from 'lucide-react';
import ContentViewer from '../../components/student/ContentViewer';
import { useParams, useNavigate } from 'react-router';
import axios from 'axios';
import { useCurrentCourseStore } from '../../zustand/useCurrentCourseStore';
import { useProgressStore } from '../../zustand/progressStore';

const ViewCourseContent = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { currentCourse } = useCurrentCourseStore();
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch lessons
                const res = await axios.post(
                    `${import.meta.env.VITE_BACKEND_URL}/getLessons`,
                    { courseId: currentCourse.id }
                );
                setLessons(res.data.lessons);

                // Fetch progress for this course
                await fetchProgress(currentCourse.id);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        if (currentCourse?.id) {
            fetchData();
        }
    }, [currentCourse]);

    const toggleLessonExpansion = (lessonId) => {
        setExpandedLessons(prev => ({
            ...prev,
            [lessonId]: !prev[lessonId]
        }));
    };

    const handleContentSelect = (type, content) => {
        if (!content) return;

        // Update progress when content is selected
        const progressVector = type === 'video' ? [0.1, 0, 0] :
            type === 'quiz' ? [0, 0, 0] :
                [0, 0, 0.1];

        const lessonIdx = lessons.findIndex(l => l.id === content.lessonId);
        if (lessonIdx >= 0) {
            updateProgress(currentCourse.id, lessonIdx, progressVector);
        }

        setSelectedContent({
            type,
            item: content.path,
            title: content.title
        });
    };

    const markLessonCompleted = async (lessonId) => {
        const lessonIdx = lessons.findIndex(l => l.id === lessonId);
        if (lessonIdx >= 0) {
            await updateProgress(currentCourse.id, lessonIdx, [1, 1, 1]);
        }
    };

    const getContentIcon = (type) => {
        switch (type) {
            case 'video':
                return <Play size={14} className="text-blue-500" />;
            case 'file':
                return <FileText size={14} className="text-red-500" />;
            case 'quiz':
                return <HelpCircle size={14} className="text-green-500" />;
            default:
                return null;
        }
    };

    const getLessonProgress = (lessonIdx) => {
        return progress[currentCourse.id]?.[lessonIdx] || [0, -1, 0];
    };

    const isLessonCompleted = (lessonIdx) => {
        const [video, quiz, file] = getLessonProgress(lessonIdx);
        return video === 1 && (quiz === -1 || quiz === 1) && file === 1;
    };

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#FFFDF6' }}>
            {/* Header remains the same */}
            {/* ... */}

            <div className="flex flex-1 min-h-screen">
                {/* Left Lesson Sidebar */}
                <div className="w-80 bg-white border-r shadow-sm overflow-y-auto">
                    <div className="p-4">
                        <h2 className="text-xl font-bold mb-4" style={{ color: '#2E4057' }}>
                            Course Lessons
                        </h2>

                        {progressLoading ? (
                            <div>Loading progress...</div>
                        ) : (
                            <div className="space-y-2">
                                {lessons.map((lesson, index) => {
                                    const [videoProgress, quizProgress, fileProgress] = getLessonProgress(index);
                                    const completed = isLessonCompleted(index);

                                    return (
                                        <div key={lesson.id} className="border rounded-lg overflow-hidden" style={{
                                            backgroundColor: '#DDEB9D',
                                            borderColor: completed ? '#10B981' : '#DDEB9D'
                                        }}>
                                            {/* Lesson Header */}
                                            <div
                                                className="p-4 cursor-pointer hover:bg-opacity-80 transition-all duration-200"
                                                onClick={() => toggleLessonExpansion(lesson.id)}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="text-sm font-semibold" style={{ color: '#2E4057' }}>
                                                                Lesson {index + 1}
                                                            </span>
                                                            {completed && <Check size={16} className="text-green-600" />}
                                                            {expandedLessons[lesson.id] ?
                                                                <ChevronDown size={16} style={{ color: '#2E4057' }} /> :
                                                                <ChevronRight size={16} style={{ color: '#2E4057' }} />
                                                            }
                                                        </div>

                                                        <div className="flex items-center gap-4 mt-2 text-xs" style={{ color: '#2E4057' }}>
                                                            <span>Video: {Math.round(videoProgress * 100)}%</span>
                                                            <span>Quiz: {quizProgress >= 0 ? `${Math.round(quizProgress * 100)}%` : 'Not taken'}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {expandedLessons[lesson.id] && (
                                                <div className="border-t bg-white bg-opacity-50">
                                                    <div className="p-2">
                                                        {/* Video */}
                                                        <div
                                                            className={`flex items-center gap-3 p-2 rounded hover:bg-white hover:bg-opacity-70 transition-colors text-sm cursor-pointer ${selectedContent.type === 'video' && selectedContent.item === lesson.video?.path ?
                                                                    'bg-white bg-opacity-70' : ''
                                                                }`}
                                                            onClick={() => handleContentSelect('video', { ...lesson.video, lessonId: lesson.id })}
                                                        >
                                                            {getContentIcon('video')}
                                                            <span className="flex-1" style={{ color: '#2E4057' }}>
                                                                {lesson.video?.title}
                                                            </span>
                                                            {videoProgress === 1 && <Check size={14} className="text-green-500" />}
                                                        </div>

                                                        {/* Quiz */}
                                                        <div
                                                            className={`flex items-center gap-3 p-2 rounded hover:bg-white hover:bg-opacity-70 transition-colors text-sm cursor-pointer ${selectedContent.type === 'quiz' && selectedContent.item === lesson.quiz?.path ?
                                                                    'bg-white bg-opacity-70' : ''
                                                                }`}
                                                            onClick={() => handleContentSelect('quiz', { ...lesson.quiz, lessonId: lesson.id })}
                                                        >
                                                            {getContentIcon('quiz')}
                                                            <span className="flex-1" style={{ color: '#2E4057' }}>
                                                                {lesson.quiz?.title}
                                                            </span>
                                                            {quizProgress === 1 && <Check size={14} className="text-green-500" />}
                                                        </div>

                                                        {/* File */}
                                                        <div
                                                            className={`flex items-center gap-3 p-2 rounded hover:bg-white hover:bg-opacity-70 transition-colors text-sm cursor-pointer ${selectedContent.type === 'file' && selectedContent.item === lesson.file?.path ?
                                                                    'bg-white bg-opacity-70' : ''
                                                                }`}
                                                            onClick={() => handleContentSelect('file', { ...lesson.file, lessonId: lesson.id })}
                                                        >
                                                            {getContentIcon('file')}
                                                            <span className="flex-1" style={{ color: '#2E4057' }}>
                                                                {lesson.file?.title}
                                                            </span>
                                                            {fileProgress === 1 && <Check size={14} className="text-green-500" />}
                                                        </div>

                                                        {/* Mark as Completed Button */}
                                                        <div className="mt-2">
                                                            <button
                                                                onClick={() => markLessonCompleted(lesson.id)}
                                                                className={`w-full py-2 rounded-md text-sm font-medium transition-colors ${completed ?
                                                                        'bg-green-500 text-white' :
                                                                        'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                                                    }`}
                                                            >
                                                                {completed ? 'Completed' : 'Mark as Completed'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                <ContentViewer
                    selectedType={selectedContent.type}
                    selectedItem={selectedContent.item}
                    title={selectedContent.title}
                />  
            </div>
        </div>
    );
};

export default ViewCourseContent;