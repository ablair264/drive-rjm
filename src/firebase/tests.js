import {
  collection,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
  getDocs,
  where,
  Timestamp
} from 'firebase/firestore';
import { db } from './config';

const TESTS_COLLECTION = 'tests';

export async function createTest(testData) {
  try {
    const payload = {
      student_id: testData.student_id,
      student_name: testData.student_name,
      car: testData.car || 'instructor',
      location: testData.location || 'Worcester Test Centre',
      date: testData.date instanceof Date ? Timestamp.fromDate(testData.date) : testData.date,
      time: testData.time,
      notes: testData.notes || '',
      status: testData.status || 'booked',
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    };

    const ref = await addDoc(collection(db, TESTS_COLLECTION), payload);
    return { success: true, id: ref.id };
  } catch (error) {
    console.error('Error creating test:', error);
    return { success: false, error: error.message };
  }
}

export async function updateTest(testId, updates) {
  try {
    const ref = doc(db, TESTS_COLLECTION, testId);
    await updateDoc(ref, {
      ...updates,
      updated_at: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating test:', error);
    return { success: false, error: error.message };
  }
}

export async function setTestStatus(testId, status, extra = {}) {
  return updateTest(testId, { status, ...extra });
}

export async function getTestsByStatus(status) {
  try {
    const testsQuery = query(
      collection(db, TESTS_COLLECTION),
      where('status', '==', status),
      orderBy('date'),
      orderBy('time')
    );
    const snapshot = await getDocs(testsQuery);
    return {
      success: true,
      data: snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      }))
    };
  } catch (error) {
    console.error('Error fetching tests:', error);
    return { success: false, error: error.message };
  }
}
