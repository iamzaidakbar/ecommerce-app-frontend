"use client";

import { useQuery } from "@tanstack/react-query";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { axiosInstance } from "@/lib/axios";

interface UserData {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  isEmailVerified: boolean;
  role: string;
  createdAt: string;
}

export default function UsersSection() {
  const { data: users, isLoading } = useQuery({
    queryKey: ['all-users'],
    queryFn: async () => {
      const response = await axiosInstance.get('/users');
      return response.data.data.users;
    },
  });

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <div className="text-[11px] text-gray-500">Loading users...</div>
      </div>
    );
  }

  if (!users?.length) {
    return (
      <div className="text-center py-12">
        <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <div className="text-[11px] text-gray-500">No users found</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-[11px] mb-4">MANAGE USERS</div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user: UserData) => (
          <div key={user._id} className="border p-4 space-y-2 bg-white hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="text-[11px] font-medium">
                {user.firstName} {user.lastName}
              </div>
              <div className="flex items-center space-x-2">
                {user.isEmailVerified ? (
                  <div className="flex items-center space-x-1 text-[11px] text-green-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
                    <span>Verified</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1 text-[11px] text-yellow-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-600" />
                    <span>Not Verified</span>
                  </div>
                )}
              </div>
            </div>
            <div className="text-[11px] bg-gray-100 w-fit px-2 py-1 rounded">
              {user.role}
            </div>
            <div className="text-[11px] text-gray-500">{user.email}</div>
            <div className="text-[11px] text-gray-400">
              Joined: {new Date(user.createdAt).toLocaleDateString()}
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <Button
                variant="secondary"
                className="text-[11px] flex-1"
                onClick={() => {/* TODO: Implement edit user */}}
              >
                EDIT
              </Button>
              <Button
                variant="secondary"
                className="text-[11px] flex-1"
                onClick={() => {/* TODO: Implement delete user */}}
              >
                DELETE
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 