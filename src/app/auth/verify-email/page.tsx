"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from '@/contexts/AuthContext';
import { Alert } from "@/components/ui/Alert";

const VerifyEmailPage = () => {
  const { verifyEmail, resendOtp, isLoading, error, setError, alertType } = useAuth();
  const [otp, setOtp] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await verifyEmail(otp);
    } catch (error) {
      console.error("Verification failed:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-black text-white flex items-center justify-center px-4"
    >
      <div className="w-full max-w-md">
        <motion.h1
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-4xl font-light mb-12 tracking-tight"
        >
          VERIFY EMAIL
        </motion.h1>

        <Alert 
          message={error} 
          onClose={() => setError(null)}
          type={alertType}
        />

        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <input
              type="text"
              placeholder="ENTER OTP"
              disabled={isLoading}
              className="w-full bg-transparent border-b border-gray-600 py-3 focus:outline-none focus:border-white transition-colors disabled:opacity-50"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
            />
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-white text-black py-3 font-medium hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "VERIFYING..." : "VERIFY EMAIL"}
            </button>

            <button
              type="button"
              onClick={resendOtp}
              disabled={isLoading}
              className="w-full text-sm text-gray-400 hover:text-white transition-colors"
            >
              RESEND OTP
            </button>
          </motion.div>
        </form>
      </div>
    </motion.div>
  );
};

export default VerifyEmailPage; 