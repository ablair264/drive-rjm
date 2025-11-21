import { createContext, useContext, useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase/config';
import {
  createPassEntry,
  updatePassEntry,
  deletePassEntry
} from '../firebase/recentlyPassed';

const RecentlyPassedContext = createContext();

export function useRecentlyPassed() {
  const context = useContext(RecentlyPassedContext);
  if (!context) {
    throw new Error('useRecentlyPassed must be used within RecentlyPassedProvider');
  }
  return context;
}

export function RecentlyPassedProvider({ children }) {
  const [passes, setPasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const passesQuery = query(
      collection(db, 'recentlyPassed'),
      orderBy('created_at', 'desc')
    );

    const unsubscribe = onSnapshot(
      passesQuery,
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPasses(data);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error loading recently passed:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const addPass = async (entry) => {
    return await createPassEntry(entry);
  };

  const updatePass = async (entryId, updates) => {
    return await updatePassEntry(entryId, updates);
  };

  const removePass = async (entryId) => {
    return await deletePassEntry(entryId);
  };

  const value = {
    passes,
    loading,
    error,
    addPass,
    updatePass,
    removePass
  };

  return (
    <RecentlyPassedContext.Provider value={value}>
      {children}
    </RecentlyPassedContext.Provider>
  );
}
