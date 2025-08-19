"use client";
import { createContext, useContext, useState, useEffect } from 'react';
import { authLocalService } from '../services/authLocal';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      // Tentar autenticação diretamente
      const response = await authLocalService.checkAuth();
      if (response.authenticated) {
        setUser(response.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      setError('Erro ao verificar status de autenticação');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, senha) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authLocalService.login(email, senha);
      setUser(response.usuario || response.user);
      if (response.token) {
        localStorage.setItem('token', response.token);
      }
      return response;
    } catch (error) {
      setError(error.message || 'Erro no login');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await authLocalService.logout();
      localStorage.removeItem('token');
      setUser(null);
      setError(null);
    } catch (error) {
      console.error('Erro no logout:', error);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    clearError,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
