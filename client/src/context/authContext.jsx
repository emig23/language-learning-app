import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Replace with real API calls to your backend
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('lingua_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (email, password) => {
    // TODO: replace with real API call
    // const res = await fetch('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
    // const data = await res.json();
    const mockUser = { id: '1', email, name: email.split('@')[0], language: null };
    localStorage.setItem('lingua_user', JSON.stringify(mockUser));
    setUser(mockUser);
    return mockUser;
  };

  const register = async (email, password, name) => {
    // TODO: replace with real API call
    const mockUser = { id: '1', email, name, language: null };
    localStorage.setItem('lingua_user', JSON.stringify(mockUser));
    setUser(mockUser);
    return mockUser;
  };

  const setLanguage = (language) => {
    const updated = { ...user, language };
    localStorage.setItem('lingua_user', JSON.stringify(updated));
    setUser(updated);
  };

  const logout = () => {
    localStorage.removeItem('lingua_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, setLanguage, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}