"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { loginSchema, LoginFormData } from '@/lib/validations/auth';
import { useFormValidation } from '@/hooks/useFormValidation';

const LoginPage = () => {
  const { login, isLoading, error, setError } = useAuth();
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  
  const { errors, validateForm, handleFieldValidation } = 
    useFormValidation<LoginFormData>(loginSchema);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    await handleFieldValidation(name as keyof LoginFormData, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (await validateForm(formData)) {
      try {
        await login(formData);
      } catch (error) {
        console.error("Login failed:", error);
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
        <h1 className="text-4xl font-light mb-12 tracking-tight">LOGIN</h1>

        <Alert message={error} onClose={() => setError(null)} />

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
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
              loadingText="LOGGING IN..."
            >
              LOG IN
            </Button>

            <div className="flex justify-between">
              <Link 
                href="/auth/register"
                className="text-xs tracking-wide text-gray-400 hover:text-white transition-colors relative group"
              >
                NEED AN ACCOUNT?
              </Link> 

              <Link 
                href="/auth/forgot-password"
                className="text-xs tracking-wide text-gray-400 hover:text-white transition-colors relative group"
              >
                FORGOT PASSWORD?
              </Link>
            </div>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default LoginPage; 