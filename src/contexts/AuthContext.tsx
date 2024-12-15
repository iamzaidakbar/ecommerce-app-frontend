"use client";

import { createContext, useContext, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { LoginCredentials, RegisterCredentials, VerifyEmailCredentials, ForgotPasswordCredentials, ResetPasswordCredentials } from '@/types/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  alertType: 'error' | 'success';
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  verifyEmail: (credentials: VerifyEmailCredentials) => Promise<void>;
  resendOtp: (email: string) => Promise<void>;
  setError: (error: string | null) => void;
  setAlertType: (type: 'error' | 'success') => void;
  forgotPassword: (credentials: ForgotPasswordCredentials) => Promise<void>;
  resetPassword: (credentials: ResetPasswordCredentials) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check if user is logged in on mount
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('token');
    }
    return false;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<'error' | 'success'>('error');

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authService.login(credentials);
      console.log(response, 'response1');
      if (response && response.token) {
        setIsAuthenticated(true);
        console.log(response, 'response2');
        router.push('/');
      }
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

  const verifyEmail = async (credentials: VerifyEmailCredentials) => {
    try {
      setIsLoading(true);
      setError(null);
      await authService.verifyEmail(credentials);
      router.push('/auth/login');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
      setAlertType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = async (email: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await authService.resendOtp(email);
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

  const forgotPassword = async (credentials: ForgotPasswordCredentials) => {
    try {
      setIsLoading(true);
      setError(null);
      await authService.forgotPassword(credentials);
      setError('Password reset link has been sent to your email');
      setAlertType('success');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
      setAlertType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (credentials: ResetPasswordCredentials) => {
    try {
      setIsLoading(true);
      setError(null);
      await authService.resetPassword(credentials);
      setError('Password has been updated successfully');
      setAlertType('success');
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
      setAlertType('error');
    } finally {
      setIsLoading(false);
    }
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
        forgotPassword,
        resetPassword,
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