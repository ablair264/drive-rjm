import { createContext, useContext, useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase/config';
import { createTest, updateTest, setTestStatus } from '../firebase/tests';

const TestsContext = createContext();

const normalizeDate = (value) => {
  if (!value) return null;
  if (typeof value.toDate === 'function') {
    return value.toDate();
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export function useTests() {
  const context = useContext(TestsContext);
  if (!context) {
    throw new Error('useTests must be used within TestsProvider');
  }
  return context;
}

export function TestsProvider({ children }) {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const testsQuery = query(collection(db, 'tests'), orderBy('date'), orderBy('time'));

    const unsubscribe = onSnapshot(
      testsQuery,
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: normalizeDate(doc.data().date)
        }));
        setTests(data);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error fetching tests:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const addTest = async (payload) => {
    return await createTest(payload);
  };

  const editTest = async (testId, updates) => {
    return await updateTest(testId, updates);
  };

  const changeTestStatus = async (testId, status, extra = {}) => {
    return await setTestStatus(testId, status, extra);
  };

  const value = {
    tests,
    loading,
    error,
    addTest,
    editTest,
    changeTestStatus
  };

  return <TestsContext.Provider value={value}>{children}</TestsContext.Provider>;
}
