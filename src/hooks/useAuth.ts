import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { LoginCredentials, RegisterCredentials } from '@/types/auth';
import { useAuth } from '@/contexts/AuthContext';

export const useAuth_ = () => {
  const { setAlertType } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      setError(null);
      await authService.login(credentials);
      router.push('/');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
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
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    router.push('/auth/login');
  };

  const verifyEmail = async (otp: string, email: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await authService.verifyEmail({ otp, email });
      router.push('/auth/login');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
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

  return { 
    login, 
    register, 
    logout, 
    verifyEmail, 
    resendOtp, 
    isLoading, 
    error, 
    setError 
  };
}; 