import * as Yup from 'yup';

export const loginSchema = Yup.object({
  email: Yup.string()
    .required('Email is required')
    .email('Invalid email format'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
});

export const registerSchema = Yup.object({
  firstName: Yup.string()
    .required('First name is required')
    .matches(/^[a-zA-Z\s]*$/, 'First name can only contain letters')
    .min(2, 'First name must be at least 2 characters'),
  lastName: Yup.string()
    .required('Last name is required')
    .matches(/^[a-zA-Z\s]*$/, 'Last name can only contain letters')
    .min(2, 'Last name must be at least 2 characters'),
  email: Yup.string()
    .required('Email is required')
    .email('Invalid email format'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain uppercase, lowercase and number'
    )
});

export const verifyEmailSchema = Yup.object({
  otp: Yup.string()
    .required('OTP is required')
    .matches(/^\d{6}$/, 'OTP must be 6 digits')
});

export const forgotPasswordSchema = Yup.object({
  email: Yup.string()
    .required('Email is required')
    .email('Invalid email format')
});

export const resetPasswordSchema = Yup.object({
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain uppercase, lowercase and number'
    ),
  confirmPassword: Yup.string()
    .required('Please confirm your password')
    .oneOf([Yup.ref('password')], 'Passwords must match')
});

export type LoginFormData = Yup.InferType<typeof loginSchema>;
export type RegisterFormData = Yup.InferType<typeof registerSchema>;

// Common validation function
export const validateField = async (
  schema: Yup.ObjectSchema<Record<string, string>>,
  field: string,
  value: string
) => {
  try {
    await schema.validateAt(field, { [field]: value });
    return undefined;
  } catch (error) {
    if (error instanceof Yup.ValidationError) {
      return error.message;
    }
    return 'Validation error occurred';
  }
}; 