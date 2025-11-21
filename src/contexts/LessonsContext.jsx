import { createContext, useContext, useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import {
  createLesson as createLessonFirebase,
  updateLesson as updateLessonFirebase,
  cancelLesson as cancelLessonFirebase,
  deleteLesson as deleteLessonFirebase,
  completeLesson as completeLessonFirebase
} from '../firebase/lessons';
import { addDaysToDate } from '../utils/dateHelpers';

const LessonsContext = createContext();

export function useLessons() {
  const context = useContext(LessonsContext);
  if (!context) {
    throw new Error('useLessons must be used within LessonsProvider');
  }
  return context;
}

export function LessonsProvider({ children }) {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    start: addDaysToDate(new Date(), -60), // 2 months back
    end: addDaysToDate(new Date(), 60)     // 2 months forward
  });

  // Real-time listener for lessons in date range
  useEffect(() => {
    const lessonsQuery = query(
      collection(db, 'lessons'),
      where('date', '>=', Timestamp.fromDate(dateRange.start)),
      where('date', '<=', Timestamp.fromDate(dateRange.end)),
      orderBy('date'),
      orderBy('start_time')
    );

    const unsubscribe = onSnapshot(
      lessonsQuery,
      (snapshot) => {
        const lessonsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date.toDate() // Convert Timestamp to Date
        }));
        setLessons(lessonsData);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error fetching lessons:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [dateRange]);

  const createLesson = async (lessonData) => {
    return await createLessonFirebase(lessonData);
  };

  const updateLesson = async (lessonId, updates) => {
    return await updateLessonFirebase(lessonId, updates);
  };

  const cancelLesson = async (lessonId) => {
    return await cancelLessonFirebase(lessonId);
  };

  const deleteLesson = async (lessonId) => {
    return await deleteLessonFirebase(lessonId);
  };

  const completeLesson = async (lessonId) => {
    return await completeLessonFirebase(lessonId);
  };

  const getLessonsForDate = (date) => {
    return lessons.filter(lesson => {
      const lessonDate = new Date(lesson.date);
      return (
        lessonDate.getFullYear() === date.getFullYear() &&
        lessonDate.getMonth() === date.getMonth() &&
        lessonDate.getDate() === date.getDate()
      );
    });
  };

  const getLessonsByStudent = (studentId) => {
    return lessons.filter(lesson => lesson.student_id === studentId);
  };

  const expandDateRange = (newStart, newEnd) => {
    setDateRange({ start: newStart, end: newEnd });
  };

  const value = {
    lessons,
    loading,
    error,
    createLesson,
    updateLesson,
    cancelLesson,
    deleteLesson,
    completeLesson,
    getLessonsForDate,
    getLessonsByStudent,
    expandDateRange
  };

  return (
    <LessonsContext.Provider value={value}>
      {children}
    </LessonsContext.Provider>
  );
}
