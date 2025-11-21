import { createContext, useContext, useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import {
  createStudent as createStudentFirebase,
  updateStudent as updateStudentFirebase,
  archiveStudent as archiveStudentFirebase,
  checkEmailExists
} from '../firebase/students';

const StudentsContext = createContext();

export function useStudents() {
  const context = useContext(StudentsContext);
  if (!context) {
    throw new Error('useStudents must be used within StudentsProvider');
  }
  return context;
}

export function StudentsProvider({ children }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Real-time listener for students
  useEffect(() => {
    const studentsQuery = query(
      collection(db, 'students'),
      orderBy('name')
    );

    const unsubscribe = onSnapshot(
      studentsQuery,
      (snapshot) => {
        const studentsData = snapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          .filter(student => student.archived !== true);
        setStudents(studentsData);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error fetching students:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const createStudent = async (studentData, imageFile = null) => {
    // Check email uniqueness
    const emailCheck = await checkEmailExists(studentData.email);
    if (emailCheck.exists) {
      return { success: false, error: 'A student with this email already exists' };
    }

    return await createStudentFirebase(studentData, imageFile);
  };

  const updateStudent = async (studentId, updates) => {
    // If email is being updated, check uniqueness
    if (updates.email) {
      const emailCheck = await checkEmailExists(updates.email, studentId);
      if (emailCheck.exists) {
        return { success: false, error: 'A student with this email already exists' };
      }
    }

    return await updateStudentFirebase(studentId, updates);
  };

  const archiveStudent = async (studentId) => {
    return await archiveStudentFirebase(studentId);
  };

  const getStudentById = (studentId) => {
    return students.find(s => s.id === studentId);
  };

  const value = {
    students,
    loading,
    error,
    createStudent,
    updateStudent,
    archiveStudent,
    getStudentById
  };

  return (
    <StudentsContext.Provider value={value}>
      {children}
    </StudentsContext.Provider>
  );
}
