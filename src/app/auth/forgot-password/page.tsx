"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { forgotPasswordSchema } from '@/lib/validations/auth';
import { useFormValidation } from '@/hooks/useFormValidation';

const ForgotPasswordPage = () => {
  const { forgotPassword, isLoading, error, setError, alertType } = useAuth();
  const [email, setEmail] = useState("");
  
  const { errors, validateForm, handleFieldValidation } = 
    useFormValidation<{ email: string }>(forgotPasswordSchema);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (await validateForm({ email })) {
      try {
        await forgotPassword({ email });
      } catch (error) {
        console.error("Password reset request failed:", error);
      }
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setEmail(value);
    await handleFieldValidation('email', value);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-black text-white flex items-center justify-center px-4"
    >
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-light mb-12 tracking-tight">RESET PASSWORD</h1>

        <Alert message={error} onClose={() => setError(null)} type={alertType} />

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <Input
              type="email"
              name="email"
              placeholder="EMAIL"
              disabled={isLoading}
              value={email}
              onChange={handleChange}
              error={errors.email}
            />
          </div>

          <div className="space-y-6">
            <Button
              type="submit"
              isLoading={isLoading}
              loadingText="SENDING..."
            >
              SEND RESET LINK
            </Button>

            <div className="flex justify-start">
              <Link 
                href="/auth/login"
                className="text-xs tracking-wide text-gray-400 hover:text-white transition-colors"
              >
                BACK TO LOGIN
              </Link>
            </div>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default ForgotPasswordPage; 