import { createContext, useState, useEffect, useContext } from 'react';
import { adminAuthService } from '../services/adminAuthService.js';

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedAdmin = localStorage.getItem('admin');
    if (storedAdmin) {
      try {
        setAdmin(JSON.parse(storedAdmin));
      } catch (e) {
        localStorage.removeItem('admin');
      }
    }
    setLoading(false);
  }, []);

  const checkAuth = async () => {
    try {
      const response = await adminAuthService.getProfile();
      if (response.data?.admin) {
        setAdmin(response.data.admin);
      }
    } catch (error) {
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await adminAuthService.login(credentials);
      if (response.data?.admin) {
        setAdmin(response.data.admin);
        localStorage.setItem('admin', JSON.stringify(response.data.admin));
        return { success: true };
      }
      return { success: false, message: 'Login failed' };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const logout = async () => {
    try {
      await adminAuthService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setAdmin(null);
      localStorage.removeItem('admin');
    }
  };

  return (
    <AdminAuthContext.Provider value={{ 
      admin, 
      loading, 
      login, 
      logout, 
      checkAuth,
      isAuthenticated: !!admin 
    }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
