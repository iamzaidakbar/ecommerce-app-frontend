"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const VerifyEmailPage = () => {
  const router = useRouter();
  const { verifyEmail, resendOtp, isLoading, error, setError, alertType } = useAuth();
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    // Check sessionStorage only after component mounts
    const storedEmail = sessionStorage.getItem('verificationEmail');
    setEmail(storedEmail);
    
    if (!storedEmail) {
      router.push('/auth/register');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      try {
        await verifyEmail({ otp, email });
      } catch (error) {
        console.error("Verification failed:", error);
      }
    }
  };

  const handleResendOtp = async () => {
    if (email) {
      await resendOtp(email);
    }
  };

  if (!email) return null; // Don't render anything until email is loaded

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex items-center justify-center px-4"
    >
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-light mb-12 tracking-tight">VERIFY EMAIL</h1>

        <Alert message={error} onClose={() => setError(null)} type={alertType} />

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <Input
              type="text"
              placeholder="ENTER OTP"
              disabled={isLoading}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
            />
          </div>

          <div className="space-y-6">
            <Button
              type="submit"
              isLoading={isLoading}
              loadingText="VERIFYING..."
            >
              VERIFY EMAIL
            </Button>

            <div className="flex justify-start">
              <Button
                type="button"
                variant="ghost"
                onClick={handleResendOtp}
                disabled={isLoading}
              >
                RESEND OTP
              </Button>
            </div>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default VerifyEmailPage; 