import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);
const API = '/api';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('voca_token'));
  const [loading, setLoading] = useState(true);

  // Fetch user profile if token
  useEffect(() => {
    if (token) {
      fetchUser(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async (t) => {
    try {
      const res = await fetch('/users/me', {
        headers: { Authorization: `Bearer ${t}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        // Token expired or invalid
        localStorage.removeItem('voca_token');
        setToken(null);
        setUser(null);
      }
    } catch (err) {
      console.error('Failed to fetch user:', err);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const res = await fetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Login failed');
    }

    localStorage.setItem('voca_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const register = async (email, password, name) => {
    const res = await fetch('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Registration failed');
    }

    localStorage.setItem('voca_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const setLanguage = async (language) => {
    try {
      const res = await fetch('/users/language', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ language })
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    } catch (err) {
      console.error('Failed to set language:', err);
    }
  };

  const logout = () => {
    localStorage.removeItem('voca_token');
    setToken(null);
    setUser(null);
  };

  // Show nothing while checking token on first load
  if (loading) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, setLanguage, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}