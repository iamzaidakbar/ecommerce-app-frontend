"use client";

import { createContext, useContext, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { LoginCredentials, RegisterCredentials } from '@/types/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  alertType: 'error' | 'success';
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  verifyEmail: (otp: string) => Promise<void>;
  resendOtp: () => Promise<void>;
  setError: (error: string | null) => void;
  setAlertType: (type: 'error' | 'success') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<'error' | 'success'>('error');

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      setError(null);
      await authService.login(credentials);
      setIsAuthenticated(true);
      router.push('/');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
      setAlertType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      setIsLoading(true);
      setError(null);
      await authService.register(credentials);
      router.push('/auth/verify-email');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
      setAlertType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyEmail = async (otp: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await authService.verifyEmail(otp);
      router.push('/auth/login');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
      setAlertType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await authService.resendOtp();
      setError('OTP has been sent to your email');
      setAlertType('success');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
      setAlertType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    router.push('/auth/login');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        error,
        alertType,
        login,
        register,
        logout,
        verifyEmail,
        resendOtp,
        setError,
        setAlertType,
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