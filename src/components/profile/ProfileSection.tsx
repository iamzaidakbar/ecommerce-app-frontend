"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { axiosInstance } from "@/lib/axios";
import { useFormValidation } from '@/hooks/useFormValidation';
import { profileSchema, ProfileFormData } from '@/lib/validations/profile';
import { User } from "@/types/user";

interface ProfileSectionProps {
  userData: User;
}

export default function ProfileSection({ userData }: ProfileSectionProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    firstName: userData?.firstName || "",
    lastName: userData?.lastName || "",
    email: userData?.email || "",
  });

  const { errors: profileErrors, validateForm: validateProfile, handleFieldValidation: validateProfileField } = 
    useFormValidation<ProfileFormData>(profileSchema);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: { firstName: string; lastName: string }) => {
      const response = await axiosInstance.put('/users/profile', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
    },
  });

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    await validateProfileField(name as keyof ProfileFormData, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (await validateProfile(formData)) {
      updateProfileMutation.mutate(formData);
    }
  };

  const handleVerifyEmail = () => {
    if (userData?.email) {
      sessionStorage.setItem("verificationEmail", userData.email);
      router.push("/auth/verify-email");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Verification Status */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <h1 className="text-[11px] uppercase tracking-wider">My Profile</h1>
          {userData?.isEmailVerified ? (
            <div className="flex items-center space-x-1 text-[11px] text-green-600">
              <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
              <span>Verified</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 text-[11px] text-yellow-600">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-600" />
                <span>Not Verified</span>
              </div>
              <button
                onClick={handleVerifyEmail}
                className="text-[11px] underline hover:opacity-70"
              >
                Verify Now
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Not Verified Warning */}
      {!userData?.isEmailVerified && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 p-4">
          <div className="text-[11px] text-yellow-800 font-medium mb-1">
            Email Not Verified
          </div>
          <p className="text-[11px] text-yellow-700">
            Please verify your email to access all features including checkout.{" "}
            <button
              onClick={handleVerifyEmail}
              className="underline hover:opacity-70"
            >
              Verify now
            </button>
          </p>
        </div>
      )}

      {/* Profile Form */}
      <div>
        <div className="text-[11px] mb-2">PERSONAL INFORMATION</div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              placeholder="First Name"
              onChange={handleInputChange}
              disabled={updateProfileMutation.isPending}
              className={`w-full border p-3 text-[11px] focus:outline-none disabled:bg-gray-50 
                ${profileErrors.firstName ? 'border-red-500' : 'border-gray-200'}`}
            />
            {profileErrors.firstName && (
              <p className="mt-1 text-[10px] text-red-500">{profileErrors.firstName}</p>
            )}
          </div>

          <div>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              placeholder="Last Name"
              onChange={handleInputChange}
              disabled={updateProfileMutation.isPending}
              className={`w-full border p-3 text-[11px] focus:outline-none disabled:bg-gray-50 
                ${profileErrors.lastName ? 'border-red-500' : 'border-gray-200'}`}
            />
            {profileErrors.lastName && (
              <p className="mt-1 text-[10px] text-red-500">{profileErrors.lastName}</p>
            )}
          </div>

          <input
            type="email"
            name="email"
            value={formData.email}
            placeholder="Email"
            disabled
            className="w-full border p-3 text-[11px] focus:outline-none disabled:bg-gray-50"
          />

          <Button
            type="submit"
            className="text-[11px]"
            isLoading={updateProfileMutation.isPending}
            loadingText="UPDATING..."
          >
            UPDATE PROFILE
          </Button>

          {updateProfileMutation.isSuccess && (
            <p className="text-[11px] text-green-600">
              Profile updated successfully
            </p>
          )}

          {updateProfileMutation.isError && (
            <p className="text-[11px] text-red-600">
              Failed to update profile
            </p>
          )}
        </form>
      </div>

      {/* Email Preferences */}
      <div>
        <div className="text-[11px] mb-2">EMAIL PREFERENCES</div>
        <label className="flex items-center space-x-2">
          <input type="checkbox" className="form-checkbox" />
          <span className="text-[11px]">
            I want to receive Zara news about new products and special offers
          </span>
        </label>
      </div>
    </div>
  );
} 