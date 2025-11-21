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
import { db, storage } from './config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const STUDENTS_COLLECTION = 'students';

// Create a new student
async function uploadStudentImage(file, studentId) {
  const extension = file.name?.split('.').pop() || 'jpg';
  const storageRef = ref(storage, `students/${studentId}/profile-${Date.now()}.${extension}`);
  await uploadBytes(storageRef, file);
  const downloadUrl = await getDownloadURL(storageRef);
  return { url: downloadUrl, path: storageRef.fullPath };
}

export async function createStudent(studentData, imageFile = null) {
  try {
    const docRef = await addDoc(collection(db, STUDENTS_COLLECTION), {
      ...studentData,
      emergency_contact: studentData.emergency_contact || { name: '', phone: '', relationship: '' },
      lesson_history: studentData.lesson_history || {
        hours_taught: 0,
        theory_passed: false,
        test_booked: false,
        test_date: null
      },
      created_at: serverTimestamp(),
      image: studentData.image || '',
      image_path: '',
      updated_at: serverTimestamp()
    });

    if (typeof File !== 'undefined' && imageFile instanceof File) {
      try {
        const uploaded = await uploadStudentImage(imageFile, docRef.id);
        await updateDoc(docRef, {
          image: uploaded.url,
          image_path: uploaded.path,
          updated_at: serverTimestamp()
        });
      } catch (uploadError) {
        console.error('Error uploading student image:', uploadError);
      }
    }

    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error creating student:', error);
    return { success: false, error: error.message };
  }
}

// Update existing student
export async function updateStudent(studentId, updates) {
  try {
    const studentRef = doc(db, STUDENTS_COLLECTION, studentId);
    await updateDoc(studentRef, {
      ...updates,
      updated_at: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating student:', error);
    return { success: false, error: error.message };
  }
}

// Delete student (soft delete - just mark as archived)
export async function archiveStudent(studentId) {
  try {
    const studentRef = doc(db, STUDENTS_COLLECTION, studentId);
    await updateDoc(studentRef, {
      archived: true,
      updated_at: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Error archiving student:', error);
    return { success: false, error: error.message };
  }
}

// Get single student by ID
export async function getStudent(studentId) {
  try {
    const studentRef = doc(db, STUDENTS_COLLECTION, studentId);
    const studentSnap = await getDoc(studentRef);

    if (studentSnap.exists()) {
      return { success: true, data: { id: studentSnap.id, ...studentSnap.data() } };
    } else {
      return { success: false, error: 'Student not found' };
    }
  } catch (error) {
    console.error('Error getting student:', error);
    return { success: false, error: error.message };
  }
}

// Get all students (excluding archived)
export async function getAllStudents() {
  try {
    const studentsQuery = query(
      collection(db, STUDENTS_COLLECTION),
      where('archived', '!=', true),
      orderBy('archived'),
      orderBy('name')
    );

    const querySnapshot = await getDocs(studentsQuery);
    const students = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return { success: true, data: students };
  } catch (error) {
    console.error('Error getting students:', error);
    return { success: false, error: error.message };
  }
}

// Check if email already exists (for uniqueness validation)
export async function checkEmailExists(email, excludeStudentId = null) {
  try {
    const studentsQuery = query(
      collection(db, STUDENTS_COLLECTION),
      where('email', '==', email)
    );

    const querySnapshot = await getDocs(studentsQuery);

    if (excludeStudentId) {
      // Exclude the current student when editing
      const exists = querySnapshot.docs.some(doc => doc.id !== excludeStudentId);
      return { success: true, exists };
    } else {
      return { success: true, exists: !querySnapshot.empty };
    }
  } catch (error) {
    console.error('Error checking email:', error);
    return { success: false, error: error.message };
  }
}
