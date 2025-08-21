'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthContextType, RegisterRequest } from '@/types/auth';
import { apiClient } from '@/utils/api-client';
import { parseValidationErrors, createStructuredError, ErrorContext } from '@/utils/errorUtils';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const token = apiClient.getToken();
      if (token) {
        await getCurrentUser();
      }
    } catch (error) {
      console.error('Auth initialization failed:', error);
      apiClient.setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentUser = async () => {
    try {
      const response = await apiClient.get('/auth/profile');
      // Backend returns { success: true, data: { user } }
      const { data } = response;
      setUser(data.user || data); // Handle both formats for safety
    } catch (error) {
      console.error('Failed to get current user:', error);
      apiClient.setToken(null);
      setUser(null);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await apiClient.post('/auth/login', { email, password }, { skipAuth: true });
      
      // Backend returns { success: true, data: { user, accessToken } }
      const { data } = response;
      const { user: userData, accessToken } = data;
      
      apiClient.setToken(accessToken);
      setUser(userData);
    } catch (error: any) {
      console.error('Login failed:', error);
      
      const context: ErrorContext = { form: 'login', action: 'login' };
      const validationErrors = parseValidationErrors(error.message || 'Грешка при влизане в акаунта', context);
      
      throw createStructuredError(
        error.message || 'Грешка при влизане в акаунта',
        validationErrors,
        error
      );
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterRequest) => {
    try {
      setIsLoading(true);
      const response = await apiClient.post('/auth/register', userData, { skipAuth: true });
      
      // Backend returns { success: true, data: { user, accessToken } }
      const { data } = response;
      const { user: newUser, accessToken } = data;
      
      apiClient.setToken(accessToken);
      setUser(newUser);
    } catch (error: any) {
      console.error('Registration failed:', error);
      
      const context: ErrorContext = { form: 'registration', action: 'register' };
      const validationErrors = parseValidationErrors(error.message || 'Грешка при създаване на акаунта', context);
      
      throw createStructuredError(
        error.message || 'Грешка при създаване на акаунта',
        validationErrors,
        error
      );
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      apiClient.setToken(null);
      setUser(null);
      
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    }
  };

  const refreshToken = async () => {
    try {
      const response = await apiClient.post('/auth/refresh', {}, { skipAuth: true });
      // Backend returns { success: true, data: { accessToken, user } }
      const { data } = response;
      const { accessToken, user: userData } = data;
      
      apiClient.setToken(accessToken);
      setUser(userData);
    } catch (error) {
      console.error('Token refresh failed:', error);
      apiClient.setToken(null);
      setUser(null);
      throw error;
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    refreshToken,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}