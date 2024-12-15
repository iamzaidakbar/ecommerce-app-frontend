"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Alert } from "@/components/ui/Alert";
import { resetPasswordSchema } from '@/lib/validations/auth';
import { useFormValidation } from '@/hooks/useFormValidation';

const ResetPasswordPage = () => {
  const params = useParams();
  const token = params.token as string;
  const { resetPassword, isLoading, error, setError, alertType } = useAuth();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: ""
  });
  
  const { errors, validateForm, handleFieldValidation } = 
    useFormValidation(resetPasswordSchema);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (await validateForm(formData)) {
      try {
        await resetPassword({
          token,
          password: formData.password
        });
      } catch (error) {
        console.error("Password reset failed:", error);
      }
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'password' || name === 'confirmPassword') {
      setFormData(prev => ({ ...prev, [name]: value }));
      await handleFieldValidation(name, value);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex items-center justify-center px-4"
    >
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-light mb-12 tracking-tight">NEW PASSWORD</h1>

        <Alert message={error} onClose={() => setError(null)} type={alertType} />

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="password"
              name="password"
              placeholder="NEW PASSWORD"
              disabled={isLoading}
              className={`w-full bg-transparent border-b ${
                errors.password ? 'border-red-500' : 'border-gray-600'
              } py-3 focus:outline-none focus:border-white transition-colors`}
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              name="confirmPassword"
              placeholder="CONFIRM PASSWORD"
              disabled={isLoading}
              className={`w-full bg-transparent border-b ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-600'
              } py-3 focus:outline-none focus:border-white transition-colors`}
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>
            )}
          </div>

          <div className="space-y-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-white text-black py-3 font-medium hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              {isLoading ? "UPDATING..." : "UPDATE PASSWORD"}
            </button>

            <Link
              href="/auth/login"
              className="block text-center text-sm text-gray-400 hover:text-white transition-colors"
            >
              BACK TO LOGIN
            </Link>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default ResetPasswordPage; 