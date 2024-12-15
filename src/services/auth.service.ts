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
      const response = await axiosInstance.post('/auth/login', credentials);
      // Check if response has the expected structure
      if (response.data && response.data.data) {
        const { data } = response.data;  // Nested data structure from API
        // Store token and user
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Store email for verification if needed
        if (data.user && !data.user.isEmailVerified) {
          sessionStorage.setItem('verificationEmail', credentials.email);
        }
        return response.data;
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }, message?: string };
      console.error('Login error:', err.response?.data || err.message);
      throw new Error(err.response?.data?.message || 'Login failed');
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