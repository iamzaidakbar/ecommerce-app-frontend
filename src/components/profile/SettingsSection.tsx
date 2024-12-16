"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/Button";
import { axiosInstance } from "@/lib/axios";
import { useFormValidation } from '@/hooks/useFormValidation';
import { passwordSchema, PasswordFormData } from '@/lib/validations/profile';

export default function SettingsSection() {
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const { errors: passwordErrors, validateForm: validatePassword, handleFieldValidation: validatePasswordField } = 
    useFormValidation<PasswordFormData>(passwordSchema);

  const resetPasswordMutation = useMutation({
    mutationFn: async (data: PasswordFormData) => {
      const response = await axiosInstance.put('/users/change-password', data);
      return response.data;
    },
    onSuccess: () => {
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    },
  });

  const handlePasswordChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value,
    }));
    await validatePasswordField(name as keyof PasswordFormData, value);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (await validatePassword(passwordForm)) {
      try {
        await resetPasswordMutation.mutateAsync(passwordForm);
      } catch (error) {
        console.error("Failed to reset password:", error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="text-[11px] mb-2">CHANGE PASSWORD</div>
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              name="currentPassword"
              placeholder="Current Password"
              value={passwordForm.currentPassword}
              onChange={handlePasswordChange}
              className={`w-full border p-3 text-[11px] focus:outline-none 
                ${passwordErrors.currentPassword ? 'border-red-500' : 'border-gray-200'}`}
            />
            {passwordErrors.currentPassword && (
              <p className="mt-1 text-[10px] text-red-500">{passwordErrors.currentPassword}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              name="newPassword"
              placeholder="New Password"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
              className={`w-full border p-3 text-[11px] focus:outline-none 
                ${passwordErrors.newPassword ? 'border-red-500' : 'border-gray-200'}`}
            />
            {passwordErrors.newPassword && (
              <p className="mt-1 text-[10px] text-red-500">{passwordErrors.newPassword}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm New Password"
              value={passwordForm.confirmPassword}
              onChange={handlePasswordChange}
              className={`w-full border p-3 text-[11px] focus:outline-none 
                ${passwordErrors.confirmPassword ? 'border-red-500' : 'border-gray-200'}`}
            />
            {passwordErrors.confirmPassword && (
              <p className="mt-1 text-[10px] text-red-500">{passwordErrors.confirmPassword}</p>
            )}
          </div>

          <Button
            type="submit"
            className="text-[11px]"
            isLoading={resetPasswordMutation.isPending}
            loadingText="UPDATING..."
          >
            UPDATE PASSWORD
          </Button>

          {resetPasswordMutation.isSuccess && (
            <p className="text-[11px] text-green-600">
              Password updated successfully
            </p>
          )}

          {resetPasswordMutation.isError && (
            <p className="text-[11px] text-red-600">
              Failed to update password
            </p>
          )}
        </form>
      </div>

      <div>
        <div className="text-[11px] mb-2">ACCOUNT SETTINGS</div>
        <div className="w-full text-left py-4 border-t flex items-center justify-between text-[11px] hover:bg-black/5">
          <span>DELETE ACCOUNT</span>
        </div>
      </div>
    </div>
  );
} 