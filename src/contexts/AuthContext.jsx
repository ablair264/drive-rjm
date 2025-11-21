import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [isAdminAuthed, setIsAdminAuthed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for existing session
    const authed = localStorage.getItem('adminAuthed') === 'true';
    setIsAdminAuthed(authed);
    setLoading(false);
  }, []);

  const login = (username, password) => {
    // Hardcoded credentials (TODO: migrate to Firebase Auth)
    if (username === 'rowan' && password === '123') {
      setIsAdminAuthed(true);
      localStorage.setItem('adminAuthed', 'true');
      return { success: true };
    } else {
      return { success: false, error: 'Invalid username or password' };
    }
  };

  const logout = () => {
    setIsAdminAuthed(false);
    localStorage.removeItem('adminAuthed');
  };

  const value = {
    isAdminAuthed,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
