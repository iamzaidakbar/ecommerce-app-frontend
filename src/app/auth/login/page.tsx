"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAuth_ } from "@/hooks/useAuth";
import { LoginCredentials } from "@/types/auth";
import { Alert } from "@/components/ui/Alert";

const LoginPage = () => {
  const { login, isLoading, error, setError } = useAuth_();
  const [formData, setFormData] = useState<LoginCredentials>({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(formData);
    } catch (error) {
      // Error is handled by useAuth hook
      console.error("Login failed:", error);
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
          LOGIN
        </motion.h1>

        <Alert 
          message={error} 
          onClose={() => setError(null)}
        />

        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <input
              type="email"
              placeholder="EMAIL"
              disabled={isLoading}
              className="w-full bg-transparent border-b border-gray-600 py-3 focus:outline-none focus:border-white transition-colors disabled:opacity-50"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </motion.div>

          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <input
              type="password"
              placeholder="PASSWORD"
              disabled={isLoading}
              className="w-full bg-transparent border-b border-gray-600 py-3 focus:outline-none focus:border-white transition-colors disabled:opacity-50"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-white text-black py-3 font-medium hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "LOGGING IN..." : "LOG IN"}
            </button>

            <Link
              href="/auth/register"
              className="block text-center text-sm text-gray-400 hover:text-white transition-colors"
            >
              NEED AN ACCOUNT? REGISTER
            </Link>

            <Link
              href="/auth/forgot-password"
              className="block text-center text-sm text-gray-400 hover:text-white transition-colors"
            >
              FORGOT PASSWORD?
            </Link>
          </motion.div>
        </form>
      </div>
    </motion.div>
  );
};

export default LoginPage; 