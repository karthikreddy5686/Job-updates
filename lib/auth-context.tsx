'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'candidate' | 'recruiter' | 'admin';
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string, remember?: boolean) => Promise<void>;
  register: (data: { email: string; password: string; fullName: string; role: 'candidate' | 'recruiter' }) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('auth_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (e) {
        localStorage.removeItem('auth_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, remember = false) => {
    setIsLoading(true);
    try {
      // Mock authentication - simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      const role = email.toLowerCase().includes('admin') ? 'admin' : 'candidate';
      const mockUser: AuthUser = {
        id: 'user_' + Date.now(),
        email,
        name: email.split('@')[0],
        role,
      };

      setUser(mockUser);
      localStorage.setItem('auth_user', JSON.stringify(mockUser));
      if (remember) {
        localStorage.setItem('auth_remember', 'true');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: { email: string; password: string; fullName: string; role: 'candidate' | 'recruiter' }) => {
    setIsLoading(true);
    try {
      // Mock registration - simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockUser: AuthUser = {
        id: 'user_' + Date.now(),
        email: data.email,
        name: data.fullName,
        role: data.role,
      };

      setUser(mockUser);
      localStorage.setItem('auth_user', JSON.stringify(mockUser));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_remember');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
