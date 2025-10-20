import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/lib/api';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string, passwordConfirmation: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    const token = localStorage.getItem('auth_token');
    if (token) {
      const response = await api.getProfile();
      if (response.data) {
        setUser(response.data as User);
      } else {
        localStorage.removeItem('auth_token');
      }
    }
    setIsLoading(false);
  }

  async function login(email: string, password: string) {
    const response = await api.login(email, password);
    if (response.data && (response.data as any).token) {
      localStorage.setItem('auth_token', (response.data as any).token);
      setUser((response.data as any).user);
      return { success: true };
    }
    return { success: false, error: response.error };
  }

  async function register(name: string, email: string, password: string, passwordConfirmation: string) {
    const response = await api.register(name, email, password, passwordConfirmation);
    if (response.data && (response.data as any).token) {
      localStorage.setItem('auth_token', (response.data as any).token);
      setUser((response.data as any).user);
      return { success: true };
    }
    return { success: false, error: response.error };
  }

  function logout() {
    api.logout();
    setUser(null);
  }

  function updateUser(userData: Partial<User>) {
    setUser(prev => prev ? { ...prev, ...userData } : null);
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isLoading, 
      login, 
      register, 
      logout,
      updateUser 
    }}>
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
