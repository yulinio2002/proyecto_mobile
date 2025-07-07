// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import * as Keychain from 'react-native-keychain';
import Api from '../services/api';
import { AuthResponse } from '../interfaces/auth/AuthResponse';

interface AuthContextType {
  session: string | null;
  userId: number | null;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const credentials = await Keychain.getInternetCredentials('auth');
      if (credentials) {
        const { password: token, username: id } = credentials;
        setSession(token);
        setUserId(parseInt(id));
        
        const api = await Api.getInstance();
        api.authorization = token;
      }
    } catch (error) {
      console.error('Error loading stored auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: { email: string; password: string }) => {
    const api = await Api.getInstance();
    type LoginResponse = { token: string; id: number };
    const response = await api.post<AuthResponse>(credentials, { url: '/auth/login' });
    
    const { token, id } = response.data;
    
    // Guardar en keychain
    await Keychain.setInternetCredentials('auth', id.toString(), token);
    
    setSession(token);
    setUserId(id);
    api.authorization = token;
  };

  const logout = async () => {
    try {
      await Keychain.resetInternetCredentials('auth');
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