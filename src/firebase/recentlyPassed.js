import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  orderBy,
  query,
  getDocs
} from 'firebase/firestore';
import { db } from './config';

const RECENTLY_PASSED_COLLECTION = 'recentlyPassed';

export async function createPassEntry(entryData) {
  try {
    const docRef = await addDoc(collection(db, RECENTLY_PASSED_COLLECTION), {
      name: entryData.name,
      tests: entryData.tests || '',
      desc: entryData.desc,
      image: entryData.image || '',
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error creating recently passed entry:', error);
    return { success: false, error: error.message };
  }
}

export async function updatePassEntry(entryId, updates) {
  try {
    const entryRef = doc(db, RECENTLY_PASSED_COLLECTION, entryId);
    await updateDoc(entryRef, {
      ...updates,
      updated_at: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating recently passed entry:', error);
    return { success: false, error: error.message };
  }
}

export async function deletePassEntry(entryId) {
  try {
    const entryRef = doc(db, RECENTLY_PASSED_COLLECTION, entryId);
    await deleteDoc(entryRef);
    return { success: true };
  } catch (error) {
    console.error('Error deleting recently passed entry:', error);
    return { success: false, error: error.message };
  }
}

export async function getAllPassEntries() {
  try {
    const passesQuery = query(
      collection(db, RECENTLY_PASSED_COLLECTION),
      orderBy('created_at', 'desc')
    );
    const snapshot = await getDocs(passesQuery);
    const passes = snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data()
    }));
    return { success: true, data: passes };
  } catch (error) {
    console.error('Error fetching recently passed entries:', error);
    return { success: false, error: error.message };
  }
}
