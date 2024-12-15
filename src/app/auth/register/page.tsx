"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { registerSchema, RegisterFormData } from '@/lib/validations/auth';
import { useFormValidation } from '@/hooks/useFormValidation';

const RegisterPage = () => {
  const { register, isLoading, error, setError } = useAuth();
  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  
  const { errors, validateForm, handleFieldValidation } = 
    useFormValidation<RegisterFormData>(registerSchema);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    await handleFieldValidation(name as keyof RegisterFormData, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (await validateForm(formData)) {
      try {
        await register(formData);
      } catch (error) {
        console.error("Registration failed:", error);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-black text-white flex items-center justify-center px-4"
    >
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-light mb-12 tracking-tight">CREATE ACCOUNT</h1>

        <Alert message={error} onClose={() => setError(null)} />

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="text"
                name="firstName"
                placeholder="FIRST NAME"
                disabled={isLoading}
                value={formData.firstName}
                onChange={handleChange}
                error={errors.firstName}
              />
              <Input
                type="text"
                name="lastName"
                placeholder="LAST NAME"
                disabled={isLoading}
                value={formData.lastName}
                onChange={handleChange}
                error={errors.lastName}
              />
            </div>

            <Input
              type="email"
              name="email"
              placeholder="EMAIL"
              disabled={isLoading}
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />

            <Input
              type="password"
              name="password"
              placeholder="PASSWORD"
              disabled={isLoading}
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
            />
          </div>

          <div className="space-y-6">
            <Button
              type="submit"
              isLoading={isLoading}
              loadingText="CREATING ACCOUNT..."
            >
              CREATE ACCOUNT
            </Button>

            <div className="flex justify-start">
              <Link 
                href="/auth/login"
                className="text-xs tracking-wide text-gray-400 hover:text-white transition-colors"
              >
                ALREADY HAVE AN ACCOUNT?
              </Link>
            </div>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default RegisterPage; 