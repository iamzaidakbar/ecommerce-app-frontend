import * as Yup from 'yup';

export const profileSchema = Yup.object({
  firstName: Yup.string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters')
    .matches(/^[a-zA-Z\s]*$/, 'First name can only contain letters'),
  lastName: Yup.string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .matches(/^[a-zA-Z\s]*$/, 'Last name can only contain letters'),
  email: Yup.string()
    .required('Email is required')
    .email('Invalid email format'),
});

export const passwordSchema = Yup.object({
  currentPassword: Yup.string()
    .required('Current password is required')
    .min(6, 'Password must be at least 6 characters'),
  newPassword: Yup.string()
    .required('New password is required')
    .min(6, 'Password must be at least 6 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain uppercase, lowercase and number'
    )
    .notOneOf([Yup.ref('currentPassword')], 'New password must be different'),
  confirmPassword: Yup.string()
    .required('Please confirm your password')
    .oneOf([Yup.ref('newPassword')], 'Passwords must match'),
});

export type ProfileFormData = Yup.InferType<typeof profileSchema>;
export type PasswordFormData = Yup.InferType<typeof passwordSchema>; 