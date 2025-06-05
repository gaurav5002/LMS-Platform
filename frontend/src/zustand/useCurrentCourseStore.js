// src/store/useCurrentCourseStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCurrentCourseStore = create(
  persist(
    (set) => ({
      currentCourse: null, 
      setCurrentCourse: (course) => set({ currentCourse: course }),
      clearCurrentCourse: () => set({ currentCourse: null }),
    }),
    {
      name: 'current-course-storage', 
    }
  )
);
