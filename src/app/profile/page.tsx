"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { User, Settings, Package, LogOut, Users, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { axiosInstance } from "@/lib/axios";
import { useFormValidation } from '@/hooks/useFormValidation';
import { profileSchema, passwordSchema, ProfileFormData, PasswordFormData } from '@/lib/validations/profile';


interface Order {
    id: string;
    status: string;
    createdAt: string;
    total: number;
  }

interface UserData {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  isEmailVerified: boolean;
  role: string;
  createdAt: string;
}

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  category: string;
  stock: string;
  imageUrl: string;
  images: FileList | null;
}

interface ApiError {
  type: string;
  msg: string;
  path: keyof ProductFormData;
  location: string;
}

interface ApiErrorResponse {
  response?: {
    data?: {
      errors?: ApiError[];
    };
  };
  message?: string;
}

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

type ProductFormErrors = {
  [K in keyof ProductFormData]?: string;
};

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const { logout } = useAuth();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const response = await axiosInstance.get('/users/profile');
      return response.data.data.user;
    },
  });

  useEffect(() => {
    if (data) {
      setFormData({
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        email: data.email || "",
      });
    }
  }, [data]);

  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const response = await axiosInstance.get('/orders');
      return response.data;
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: { firstName: string; lastName: string }) => {
      const response = await axiosInstance.put('/users/profile', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async (data: { currentPassword: string; newPassword: string; confirmPassword: string }) => {
      const response = await axiosInstance.put('/users/change-password', data);
      return response.data;
    },
    onSuccess: () => {
      // Show success message or redirect
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    },
    onError: (error: unknown) => {
        const err = error as { response?: { data?: { message?: string } }, message?: string };
        console.error('Failed to reset password:', err.response?.data?.message || err.message);
      }
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const { errors: profileErrors, validateForm: validateProfile, handleFieldValidation: validateProfileField } = 
    useFormValidation<ProfileFormData>(profileSchema);

  const { errors: passwordErrors, validateForm: validatePassword, handleFieldValidation: validatePasswordField } = 
    useFormValidation<PasswordFormData>(passwordSchema);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    await validateProfileField(name as keyof ProfileFormData, value);
  };

  const handlePasswordChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value,
    }));
    await validatePasswordField(name as keyof PasswordFormData, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (await validateProfile(formData)) {
      updateProfileMutation.mutate(formData);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (await validatePassword(passwordForm)) {
      try {
        await resetPasswordMutation.mutateAsync(passwordForm);
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } catch (error) {
        console.error("Failed to reset password:", error);
      }
    }
  };

  const handleVerifyEmail = () => {
    if (data?.email) {
      sessionStorage.setItem("verificationEmail", data.email);
      router.push("/auth/verify-email");
    }
  };

  const { data: allUsers, isLoading: usersLoading } = useQuery({
    queryKey: ['all-users'],
    queryFn: async () => {
      // Only fetch if user is admin
      if (data?.role === 'admin') {
        const response = await axiosInstance.get('/users');
        return response.data.data.users;
      }
      return null;
    },
    enabled: data?.role === 'admin', // Only run query if user is admin
  });

  const [productForm, setProductForm] = useState<ProductFormData>({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    imageUrl: "",
    images: null
  });

  const [productErrors, setProductErrors] = useState<ProductFormErrors>({});

  const validateProductForm = (data: ProductFormData) => {
    const errors: ProductFormErrors = {};
    
    // Validate required fields
    if (!data.name.trim()) errors.name = "Product name is required";
    if (!data.description.trim()) errors.description = "Product description is required";
    if (!data.category.trim()) errors.category = "Category is required";
    
    // Validate price
    const price = parseFloat(data.price);
    if (isNaN(price) || price <= 0) errors.price = "Price must be a positive number";
    
    // Validate stock
    const stock = parseInt(data.stock);
    if (isNaN(stock) || stock <= 0) errors.stock = "Stock must be a positive integer";
    
    setProductErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const createProductMutation = useMutation({
    mutationFn: async (data: ProductFormData) => {
      // Create request body directly as an object
      const requestBody = {
        name: data.name.trim(),
        description: data.description.trim(),
        price: parseFloat(data.price),
        category: data.category.trim(),
        stock: parseInt(data.stock),
        imageUrl: data.imageUrl?.trim() || "",
        images: data.images
      };

      const response = await axiosInstance.post('/products', requestBody);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setProductForm({
        name: "",
        description: "",
        price: "",
        category: "",
        stock: "",
        imageUrl: "",
        images: null
      });
      setProductErrors({});
    },
  });

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateProductForm(productForm)) {
      try {
        await createProductMutation.mutateAsync(productForm);
      } catch (error: unknown) {
        const apiError = error as ApiErrorResponse;
        if (apiError.response?.data?.errors) {
          const serverErrors: ProductFormErrors = {};
          apiError.response.data.errors.forEach((err: ApiError) => {
            if (err.path) {
              serverErrors[err.path] = err.msg;
            }
          });
          setProductErrors(serverErrors);
        }
      }
    }
  };


  const tabs = data?.role === 'admin' ? ADMIN_TABS : USER_TABS;

  return (
    <div className="min-h-screen pt-40 px-4">
      <div className="max-w-[1200px] mx-auto">
        {/* Header with Verification Status */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <h1 className="text-[11px] uppercase tracking-wider">My Account</h1>
            {!isLoading && (
              data?.isEmailVerified ? (
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
              )
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
        {!isLoading && !data?.isEmailVerified && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 p-4">
            <div className="text-[11px] text-yellow-800 font-medium mb-1">
              Email Not Verified
            </div>
            <p className="text-[11px] text-yellow-700">
              Please verify your email to access all features including
              checkout.{" "}
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
        <div className={`grid ${data?.role === 'admin' ? 'grid-cols-5' : 'grid-cols-3'} gap-0.5 mb-8 bg-gray-100`}>
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={`tab-${id}`}
              onClick={() => setActiveTab(id)}
              className={`py-3 text-[11px] tracking-wider flex items-center justify-center space-x-1.5 transition-colors
                ${
                  activeTab === id 
                    ? "bg-black text-white" 
                    : "bg-white hover:bg-black/5"
                }`}
            >
              <Icon className="w-3 h-3" />
              <span className="whitespace-nowrap">{label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className={`${activeTab === "users" ? "max-w-full" : "max-w-[360px]"}`}>
          {activeTab === "profile" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
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

              <div>
                <div className="text-[11px] mb-2">EMAIL PREFERENCES</div>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="form-checkbox" />
                  <span className="text-[11px]">
                    I want to receive Zara news about new products and special
                    offers
                  </span>
                </label>
              </div>
            </motion.div>
          )}

          {activeTab === "orders" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {!ordersLoading && (
                orders?.length ? (
                  orders.map((order: Order) => (
                    <div key={order.id} className="border p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="text-[11px]">ORDER #{order.id}</div>
                        <div className="text-[11px] uppercase">
                          {order.status}
                        </div>
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
                )
              )}
            </motion.div>
          )}

          {activeTab === "settings" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
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
                </form>
              </div>

              <div>
                <div className="text-[11px] mb-2">ACCOUNT SETTINGS</div>
                <div key="delete-account" className="w-full text-left py-4 border-t flex items-center justify-between text-[11px] hover:bg-black/5">
                  <span>DELETE ACCOUNT</span>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "users" && data?.role === "admin" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="text-[11px] mb-4">MANAGE USERS</div>
              {!usersLoading && allUsers ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 min-w-[800px]">
                  {allUsers.map((user: UserData) => (
                    <div key={`user-${user?._id}`} className="border p-4 space-y-2 bg-white hover:shadow-md transition-shadow">
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
              ) : (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <div className="text-[11px] text-gray-500">
                    {usersLoading ? 'Loading users...' : 'No users found'}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "products" && data?.role === "admin" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="text-[11px] mb-4">MANAGE PRODUCTS</div>
              <form onSubmit={handleProductSubmit} className="space-y-4 max-w-[400px]">
                <div>
                  <input
                    type="text"
                    name="name"
                    value={productForm.name}
                    onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Product Name"
                    className={`w-full border p-3 text-[11px] focus:outline-none ${
                      productErrors.name ? 'border-red-500' : 'border-gray-200'
                    }`}
                    required
                  />
                  {productErrors.name && (
                    <p className="mt-1 text-[10px] text-red-500">{productErrors.name}</p>
                  )}
                </div>

                <div>
                  <textarea
                    name="description"
                    value={productForm.description}
                    onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Product Description"
                    className={`w-full border p-3 text-[11px] focus:outline-none min-h-[100px] ${
                      productErrors.description ? 'border-red-500' : 'border-gray-200'
                    }`}
                    required
                  />
                  {productErrors.description && (
                    <p className="mt-1 text-[10px] text-red-500">{productErrors.description}</p>
                  )}
                </div>

                <div>
                  <input
                    type="number"
                    name="price"
                    value={productForm.price}
                    onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="Price"
                    step="0.01"
                    min="0"
                    className={`w-full border p-3 text-[11px] focus:outline-none ${
                      productErrors.price ? 'border-red-500' : 'border-gray-200'
                    }`}
                    required
                  />
                  {productErrors.price && (
                    <p className="mt-1 text-[10px] text-red-500">{productErrors.price}</p>
                  )}
                </div>

                <div>
                  <input
                    type="number"
                    name="stock"
                    value={productForm.stock}
                    onChange={(e) => setProductForm(prev => ({ ...prev, stock: e.target.value }))}
                    placeholder="Stock Quantity"
                    min="0"
                    className={`w-full border p-3 text-[11px] focus:outline-none ${
                      productErrors.stock ? 'border-red-500' : 'border-gray-200'
                    }`}
                    required
                  />
                  {productErrors.stock && (
                    <p className="mt-1 text-[10px] text-red-500">{productErrors.stock}</p>
                  )}
                </div>

                <div>
                  <select
                    name="category"
                    value={productForm.category}
                    onChange={(e) => setProductForm(prev => ({ ...prev, category: e.target.value }))}
                    className={`w-full border p-3 text-[11px] focus:outline-none ${
                      productErrors.category ? 'border-red-500' : 'border-gray-200'
                    }`}
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="MAN">MAN</option>
                    <option value="WOMAN">WOMAN</option>
                    <option value="KID">KIDS</option>
                  </select>
                  {productErrors.category && (
                    <p className="mt-1 text-[10px] text-red-500">{productErrors.category}</p>
                  )}
                </div>

                <div>
                  <div className="text-[11px] mb-2">PRODUCT IMAGES</div>
                  <div className="space-y-3">
                    <input
                      type="url"
                      name="imageUrl"
                      value={productForm.imageUrl}
                      onChange={(e) => setProductForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                      placeholder="Image URL (Optional)"
                      className="w-full border border-gray-200 p-3 text-[11px] focus:outline-none"
                    />
                    <div className="text-center p-3 border border-dashed border-gray-200">
                      <input
                        type="file"
                        name="images"
                        onChange={(e) => setProductForm(prev => ({ ...prev, images: e.target.files }))}
                        multiple
                        accept="image/*"
                        className="w-full text-[11px] focus:outline-none file:mr-4 file:py-2 file:px-4
                          file:rounded-full file:border-0 file:text-[11px]
                          file:bg-black file:text-white
                          hover:file:bg-black/90"
                      />
                      <p className="mt-2 text-[10px] text-gray-500">
                        Or drag and drop image files here
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="text-[11px] w-full"
                  isLoading={createProductMutation.isPending}
                  loadingText="CREATING..."
                >
                  CREATE PRODUCT
                </Button>

                {createProductMutation.isSuccess && (
                  <p className="text-[11px] text-green-600">
                    Product created successfully
                  </p>
                )}

                {createProductMutation.isError && (
                  <p className="text-[11px] text-red-600">
                    Failed to create product
                  </p>
                )}
              </form>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
