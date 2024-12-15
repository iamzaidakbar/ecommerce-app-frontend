import { axiosInstance } from '@/lib/axios';
import { 
  LoginCredentials, 
  RegisterCredentials, 
  VerifyEmailCredentials,
  ForgotPasswordCredentials,
  ResetPasswordCredentials,
  AuthResponse 
} from '@/types/auth';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const { data } = await axiosInstance.post('/auth/login', credentials);
      if (!data.user.isVerified) {
        throw new Error('Please verify your email first');
      }
      localStorage.setItem('token', data.token);
      return data;
    } catch (error) {
      console.log('Login failed:', error);
      throw error;
    }
  },

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    try {
      const { data } = await axiosInstance.post('/auth/register', credentials);
      // Store email in session for OTP verification
      sessionStorage.setItem('verificationEmail', credentials.email);
      return data;
    } catch (error) {
      console.log('Registration failed:', error);
      throw error;
    }
  },

  async verifyEmail(credentials: VerifyEmailCredentials): Promise<AuthResponse> {
    try {
      const { data } = await axiosInstance.post('/auth/verify-email', credentials);
      return data;
    } catch (error) {
      console.log('Email verification failed:', error);
      throw error;
    }
  },

  async resendOtp(email: string): Promise<void> {
    try {
      await axiosInstance.post('/auth/resend-otp', { email });
    } catch (error) {
      console.log('OTP resend failed:', error);
      throw error;
    }
  },

  async forgotPassword(credentials: ForgotPasswordCredentials): Promise<void> {
    try {
      await axiosInstance.post('/auth/forgot-password', credentials);
    } catch (error) {
      console.log('Forgot password request failed:', error);
      throw error;
    }
  },

  async resetPassword(credentials: ResetPasswordCredentials): Promise<void> {
    try {
      await axiosInstance.post('/auth/reset-password', credentials);
    } catch (error) {
      console.log('Password reset failed:', error);
      throw error;
    }
  },

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}; 