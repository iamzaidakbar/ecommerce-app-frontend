import { axiosInstance } from '@/lib/axios';
import { LoginCredentials, RegisterCredentials } from '@/types/auth';

export const authService = {
  async login(credentials: LoginCredentials) {
    try {
      const { data } = await axiosInstance.post('/auth/login', credentials);
      localStorage.setItem('token', data.token);
      return data;
    } catch (error) {
      console.log('Login failed:', error);
      throw new Error('Login failed. Please check your credentials.');
    }
  },

  async register(credentials: RegisterCredentials) {
    try {
      const { data } = await axiosInstance.post('/auth/register', credentials);
      return data;
    } catch (error) {
      console.log('Registration failed:', error);
      throw new Error('Registration failed. Please try again.');
    }
  },

  async verifyEmail(otp: string) {
    try {
      const { data } = await axiosInstance.post('/auth/verify-email', { otp });
      localStorage.setItem('token', data.token);
      return data;
    } catch (error) {
      console.log('Email verification failed:', error);
      throw new Error('Invalid OTP. Please try again.');
    }
  },

  async resendOtp() {
    try {
      await axiosInstance.post('/auth/resend-otp');
      return true;
    } catch (error) {
      console.log('OTP resend failed:', error);
      throw new Error('Failed to resend OTP. Please try again.');
    }
  },

  logout() {
    localStorage.removeItem('token');
  }
}; 