import { createContext, useContext, useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase/config';
import { createEnquiry } from '../firebase/enquiries';

const EnquiriesContext = createContext();

export function useEnquiries() {
  const context = useContext(EnquiriesContext);
  if (!context) {
    throw new Error('useEnquiries must be used within EnquiriesProvider');
  }
  return context;
}

export function EnquiriesProvider({ children }) {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const enquiriesQuery = query(
      collection(db, 'enquiries'),
      orderBy('created_at', 'desc')
    );

    const unsubscribe = onSnapshot(
      enquiriesQuery,
      (snapshot) => {
        const items = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            createdAt: data.created_at ? data.created_at.toDate() : null
          };
        });
        setEnquiries(items);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error loading enquiries:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const addEnquiry = async (entry) => {
    return await createEnquiry(entry);
  };

  const value = {
    enquiries,
    loading,
    error,
    addEnquiry
  };

  return (
    <EnquiriesContext.Provider value={value}>
      {children}
    </EnquiriesContext.Provider>
  );
}
