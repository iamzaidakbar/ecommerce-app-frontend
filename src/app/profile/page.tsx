"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { User, Settings, Package, LogOut } from "lucide-react";
import { mockService } from "@/services/mock.service";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

const TABS = [
  { id: 'profile', label: 'MY PROFILE', icon: User },
  { id: 'orders', label: 'MY ORDERS', icon: Package },
  { id: 'settings', label: 'SETTINGS', icon: Settings },
] as const;

type Tab = typeof TABS[number]['id'];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });
  const { logout } = useAuth();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data } = useQuery({
    queryKey: ['user'],
    queryFn: mockService.getCurrentUser,
  });

  useEffect(() => {
    if (data) {
      setFormData({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
      });
    }
  }, [data]);

  const { data: orders } = useQuery({
    queryKey: ['orders'],
    queryFn: mockService.getOrders,
  });

  const updateProfileMutation = useMutation({
    mutationFn: mockService.updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(formData);
  };

  const handleVerifyEmail = () => {
    if (data?.email) {
      sessionStorage.setItem('verificationEmail', data.email);
      router.push('/auth/verify-email');
    }
  };

  return (
    <div className="min-h-screen pt-40 px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header with Verification Status */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center space-x-4">
            <h1 className="text-[11px] uppercase tracking-wider">My Account</h1>
            {data?.isVerified ? (
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
          <button 
            onClick={logout}
            className="text-[11px] flex items-center space-x-2 hover:opacity-70"
          >
            <LogOut className="w-3 h-3" />
            <span>LOGOUT</span>
          </button>
        </div>

        {/* Not Verified Warning */}
        {!data?.isVerified && (
          <div className="mb-8 bg-yellow-50 border border-yellow-200 p-4">
            <div className="text-[11px] text-yellow-800 font-medium mb-1">
              Email Not Verified
            </div>
            <p className="text-[11px] text-yellow-700">
              Please verify your email to access all features including checkout.
              {' '}
              <button 
                onClick={handleVerifyEmail}
                className="underline hover:opacity-70"
              >
                Verify now
              </button>
            </p>
          </div>
        )}

        {/* Tabs */}
        <div className="grid grid-cols-3 gap-1 mb-12">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`py-4 text-[11px] tracking-wider flex items-center justify-center space-x-2 transition-colors
                ${activeTab === id 
                  ? "bg-black text-white" 
                  : "hover:bg-black/5"
                }`}
            >
              <Icon className="w-3 h-3" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="max-w-[360px]">
          {activeTab === 'profile' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div>
                <div className="text-[11px] mb-2">PERSONAL INFORMATION</div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    placeholder="First Name"
                    onChange={handleInputChange}
                    className="w-full border p-3 text-[11px] focus:outline-none"
                  />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    placeholder="Last Name"
                    onChange={handleInputChange}
                    className="w-full border p-3 text-[11px] focus:outline-none"
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    placeholder="Email"
                    disabled
                    className="w-full border p-3 text-[11px] focus:outline-none disabled:bg-gray-50"
                  />
                  <Button type="submit" className="text-[11px]">
                    UPDATE PROFILE
                  </Button>
                </form>
              </div>

              <div>
                <div className="text-[11px] mb-2">EMAIL PREFERENCES</div>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="form-checkbox" />
                  <span className="text-[11px]">
                    I want to receive Zara news about new products and special offers
                  </span>
                </label>
              </div>
            </motion.div>
          )}

          {activeTab === 'orders' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {orders?.length ? (
                orders.map((order) => (
                  <div key={order.id} className="border p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="text-[11px]">ORDER #{order.id}</div>
                      <div className="text-[11px] uppercase">{order.status}</div>
                    </div>
                    <div className="text-[11px] text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                    <div className="text-[11px]">
                      Total: ${order.total.toFixed(2)}
                    </div>
                    <Button variant="secondary" className="text-[11px]">
                      VIEW DETAILS
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <div className="text-[11px] text-gray-500">
                    You haven&apos;t placed any orders yet
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div>
                <div className="text-[11px] mb-2">CHANGE PASSWORD</div>
                <div className="space-y-4">
                  <input
                    type="password"
                    placeholder="Current Password"
                    className="w-full border p-3 text-[11px] focus:outline-none"
                  />
                  <input
                    type="password"
                    placeholder="New Password"
                    className="w-full border p-3 text-[11px] focus:outline-none"
                  />
                  <input
                    type="password"
                    placeholder="Confirm New Password"
                    className="w-full border p-3 text-[11px] focus:outline-none"
                  />
                  <Button className="text-[11px]">
                    UPDATE PASSWORD
                  </Button>
                </div>
              </div>

              <div>
                <div className="text-[11px] mb-2">ACCOUNT SETTINGS</div>
                <button className="w-full text-left py-4 border-t flex items-center justify-between text-[11px] hover:bg-black/5">
                  <span>DELETE ACCOUNT</span>
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
} 