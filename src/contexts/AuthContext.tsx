// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import Api from '../services/api';
type ReactNode = any;

interface AuthContextType {
  session: string | null;
  userId: number | null;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext(undefined as any);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState(null as string | null);
  const [userId, setUserId] = useState(null as number | null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const stored = await SecureStore.getItemAsync('auth');
      if (stored) {
        const { token, id } = JSON.parse(stored);
        setSession(token);
        setUserId(id);
        const api = await Api.getInstance();
        api.authorization = token;
      }
    } catch (error) {
      console.error('Error loading stored auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async ({ email, password }: { email: string; password: string }) => {
    const api = await Api.getInstance();
    const response = await api.post<{ email: string; password: string }, { token: string; id: number }>(
      { email, password },
      { url: '/auth/login' }
    );
    const { token, id } = response.data;

    // Guarda credenciales en SecureStore
    await SecureStore.setItemAsync('auth', JSON.stringify({ token, id }));

    setSession(token);
    setUserId(id);
    api.authorization = token;
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync('auth');
      setSession(null);
      setUserId(null);
      const api = await Api.getInstance();
      api.authorization = '';
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ session, userId, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
}