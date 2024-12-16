"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { User, Settings, Package, LogOut, Users, ShoppingBag } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { axiosInstance } from "@/lib/axios";
import ProfileSection from "@/components/profile/ProfileSection";
import OrdersSection from "@/components/profile/OrdersSection";
import SettingsSection from "@/components/profile/SettingsSection";
import UsersSection from "@/components/profile/UsersSection";
import ProductsSection from "@/components/profile/ProductsSection";

const ADMIN_TABS = [
  { id: "profile", label: "MY PROFILE", icon: User },
  { id: "orders", label: "MY ORDERS", icon: Package },
  { id: "settings", label: "SETTINGS", icon: Settings },
  { id: "users", label: "MANAGE USERS", icon: Users },
  { id: "products", label: "PRODUCTS", icon: ShoppingBag },
] as const;

const USER_TABS = [
  { id: "profile", label: "MY PROFILE", icon: User },
  { id: "orders", label: "MY ORDERS", icon: Package },
  { id: "settings", label: "SETTINGS", icon: Settings },
] as const;

type AdminTab = (typeof ADMIN_TABS)[number]["id"];
type UserTab = (typeof USER_TABS)[number]["id"];
type Tab = AdminTab | UserTab;

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const { logout } = useAuth();

  const { data: userData } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const response = await axiosInstance.get('/users/profile');
      return response.data.data.user;
    },
  });

  const tabs = userData?.role === 'admin' ? ADMIN_TABS : USER_TABS;

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileSection userData={userData} />;
      case "orders":
        return <OrdersSection />;
      case "settings":
        return <SettingsSection />;
      case "users":
        return userData?.role === 'admin' ? <UsersSection /> : null;
      case "products":
        return userData?.role === 'admin' ? <ProductsSection /> : null;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen pt-40 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-2 px-4 py-2 text-left transition-colors ${
                    activeTab === tab.id
                      ? "bg-black text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <Icon size={16} />
                  <span className="text-[11px]">{tab.label}</span>
                </button>
              );
            })}
            <button
              onClick={logout}
              className="w-full flex items-center gap-2 px-4 py-2 text-left text-red-500 hover:bg-red-50 transition-colors"
            >
              <LogOut size={16} />
              <span className="text-[11px]">LOGOUT</span>
            </button>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
