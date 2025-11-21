import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  limit,
  getDocs
} from 'firebase/firestore';
import { db } from './config';

const ENQUIRIES_COLLECTION = 'enquiries';

export async function createEnquiry(enquiryData) {
  try {
    await addDoc(collection(db, ENQUIRIES_COLLECTION), {
      name: enquiryData.name,
      email: enquiryData.email,
      phone: enquiryData.phone,
      postcode: enquiryData.postcode,
      service: enquiryData.service || '',
      message: enquiryData.message || '',
      source: enquiryData.source || 'site',
      created_at: serverTimestamp(),
      status: enquiryData.status || 'new'
    });
    return { success: true };
  } catch (error) {
    console.error('Error creating enquiry:', error);
    return { success: false, error: error.message };
  }
}

export async function getRecentEnquiries(max = 50) {
  try {
    const enquiriesQuery = query(
      collection(db, ENQUIRIES_COLLECTION),
      orderBy('created_at', 'desc'),
      limit(max)
    );
    const snapshot = await getDocs(enquiriesQuery);
    return {
      success: true,
      data: snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    };
  } catch (error) {
    console.error('Error fetching enquiries:', error);
    return { success: false, error: error.message };
  }
}
