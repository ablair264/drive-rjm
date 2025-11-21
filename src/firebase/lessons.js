import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from './config';
import { addMinutes } from '../utils/timeHelpers';

const LESSONS_COLLECTION = 'lessons';

// Create a new lesson
export async function createLesson(lessonData) {
  try {
    // Calculate end_time from start_time + duration
    const end_time = addMinutes(lessonData.start_time, lessonData.duration_minutes);

    const docRef = await addDoc(collection(db, LESSONS_COLLECTION), {
      student_id: lessonData.student_id,
      student_name: lessonData.student_name,
      date: Timestamp.fromDate(new Date(lessonData.date)),
      start_time: lessonData.start_time,
      end_time: end_time,
      duration_minutes: lessonData.duration_minutes,
      start_postcode: lessonData.start_postcode,
      end_postcode: lessonData.end_postcode || lessonData.start_postcode,
      status: 'scheduled',
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    });

    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error creating lesson:', error);
    return { success: false, error: error.message };
  }
}

// Update existing lesson
export async function updateLesson(lessonId, updates) {
  try {
    const lessonRef = doc(db, LESSONS_COLLECTION, lessonId);

    // Recalculate end_time if start_time or duration changed
    const updatedData = { ...updates };
    if (updates.start_time || updates.duration_minutes) {
      const currentLesson = await getDoc(lessonRef);
      const currentData = currentLesson.data();
      const start_time = updates.start_time || currentData.start_time;
      const duration = updates.duration_minutes || currentData.duration_minutes;
      updatedData.end_time = addMinutes(start_time, duration);
    }

    await updateDoc(lessonRef, {
      ...updatedData,
      updated_at: serverTimestamp()
    });

    return { success: true };
  } catch (error) {
    console.error('Error updating lesson:', error);
    return { success: false, error: error.message };
  }
}

// Cancel lesson (soft delete - change status)
export async function cancelLesson(lessonId) {
  try {
    const lessonRef = doc(db, LESSONS_COLLECTION, lessonId);
    await updateDoc(lessonRef, {
      status: 'cancelled',
      updated_at: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Error cancelling lesson:', error);
    return { success: false, error: error.message };
  }
}

// Delete lesson permanently
export async function deleteLesson(lessonId) {
  try {
    const lessonRef = doc(db, LESSONS_COLLECTION, lessonId);
    await deleteDoc(lessonRef);
    return { success: true };
  } catch (error) {
    console.error('Error deleting lesson:', error);
    return { success: false, error: error.message };
  }
}

// Get lessons for a date range
export async function getLessonsInRange(startDate, endDate) {
  try {
    const lessonsQuery = query(
      collection(db, LESSONS_COLLECTION),
      where('date', '>=', Timestamp.fromDate(startDate)),
      where('date', '<=', Timestamp.fromDate(endDate)),
      orderBy('date'),
      orderBy('start_time')
    );

    const querySnapshot = await getDocs(lessonsQuery);
    const lessons = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date.toDate() // Convert Timestamp to Date
    }));

    return { success: true, data: lessons };
  } catch (error) {
    console.error('Error getting lessons:', error);
    return { success: false, error: error.message };
  }
}

// Get lessons for a specific student
export async function getLessonsByStudent(studentId) {
  try {
    const lessonsQuery = query(
      collection(db, LESSONS_COLLECTION),
      where('student_id', '==', studentId),
      orderBy('date', 'desc')
    );

    const querySnapshot = await getDocs(lessonsQuery);
    const lessons = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date.toDate()
    }));

    return { success: true, data: lessons };
  } catch (error) {
    console.error('Error getting student lessons:', error);
    return { success: false, error: error.message };
  }
}

// Mark lesson as completed
export async function completeLesson(lessonId) {
  try {
    const lessonRef = doc(db, LESSONS_COLLECTION, lessonId);
    await updateDoc(lessonRef, {
      status: 'completed',
      updated_at: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Error completing lesson:', error);
    return { success: false, error: error.message };
  }
}
