import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authApi } from '../api/authApi.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('greencare_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('greencare_token');
    if (!token) return;

    setLoading(true);
    authApi.me()
      .then((profile) => {
        setUser(profile);
        localStorage.setItem('greencare_user', JSON.stringify(profile));
      })
      .catch(() => logout())
      .finally(() => setLoading(false));
  }, []);

  const persistAuth = (auth) => {
    // Demo-friendly persistence. A production app should prefer secure, httpOnly cookie flows.
    localStorage.setItem('greencare_token', auth.token);
    localStorage.setItem('greencare_user', JSON.stringify(auth.user));
    setUser(auth.user);
  };

  const login = async (payload) => {
    const auth = await authApi.login(payload);
    persistAuth(auth);
    return auth.user;
  };

  const register = async (payload) => {
    const auth = await authApi.register(payload);
    persistAuth(auth);
    return auth.user;
  };

  const logout = () => {
    localStorage.removeItem('greencare_token');
    localStorage.removeItem('greencare_user');
    setUser(null);
  };

  const updateUser = (profile) => {
    setUser(profile);
    localStorage.setItem('greencare_user', JSON.stringify(profile));
  };

  const value = useMemo(() => ({
    user,
    loading,
    isAuthenticated: Boolean(user),
    isAdmin: user?.role === 'Admin',
    login,
    register,
    logout,
    updateUser,
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
