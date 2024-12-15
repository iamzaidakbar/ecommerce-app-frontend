import { useState } from 'react';
import * as Yup from 'yup';
import { validateField } from '@/lib/validations/auth';

export function useFormValidation<T extends Record<string, string>>(schema: Yup.ObjectSchema<T>) {
  const [errors, setErrors] = useState<Partial<T>>({});

  const validateForm = async (data: T) => {
    try {
      await schema.validate(data, { abortEarly: false });
      return true;
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const validationErrors = error.inner.reduce((acc, curr) => ({
          ...acc,
          [curr.path!]: curr.message
        }), {});
        setErrors(validationErrors);
      }
      return false;
    }
  };

  const handleFieldValidation = async (field: keyof T, value: string) => {
    const error = await validateField(schema, field as string, value);
    setErrors(prev => ({
      ...prev,
      [field]: error
    }));
  };

  return {
    errors,
    validateForm,
    handleFieldValidation
  };
} 