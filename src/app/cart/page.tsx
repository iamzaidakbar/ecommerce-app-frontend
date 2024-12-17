"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2, Minus, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { axiosInstance } from "@/lib/axios";
import useStore from "@/store/useStore";
import { useState } from "react";

// Define types for the cart items and user
interface Product {
  name: string;
  price: number;
  imageUrl: string;
  _id: string;
}

interface CartItem {
  _id: string;
  product: Product;
  quantity: number;
}

export default function CartPage() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { currentUser } = useStore();

  // Manage individual loading states
  const [loadingStates, setLoadingStates] = useState<{
    clearingCart: boolean;
    checkingOut: boolean;
    updatingItem: string | null; // Item ID being updated
    removingItem: string | null; // Item ID being removed
  }>({
    clearingCart: false,
    checkingOut: false,
    updatingItem: null,
    removingItem: null,
  });

  const {
    data: cartItems = [],
    isLoading,
    error,
  } = useQuery<CartItem[], Error>({
    queryKey: ["cart", "cartItems"],
    queryFn: async () => {
      const response = await axiosInstance.get(`/cart`);
      return response.data.data.cart.items || [];
    },
  });

  const removeFromCartMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await axiosInstance.delete(`/cart/${id}`);
      return response.data;
    },
    onMutate: (id) => {
      setLoadingStates((prev) => ({ ...prev, removingItem: id }));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: () => {
      setLoadingStates((prev) => ({ ...prev, removingItem: null }));
    },
    onSettled: () => {
      setLoadingStates((prev) => ({ ...prev, removingItem: null }));
    },
  });

  const updateQuantityMutation = useMutation({
    mutationFn: async ({
      productId,
      quantity,
    }: {
      productId: string;
      quantity: number;
    }) => {
      const response = await axiosInstance.put(`/cart`, {
        productId,
        quantity,
      });
      return response.data;
    },
    onMutate: ({ productId }) => {
      setLoadingStates((prev) => ({ ...prev, updatingItem: productId }));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: () => {
      setLoadingStates((prev) => ({ ...prev, updatingItem: null }));
    },
    onSettled: () => {
      setLoadingStates((prev) => ({ ...prev, updatingItem: null }));
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.delete(`/cart/clear`);
      return response.data;
    },
    onMutate: () => {
      setLoadingStates((prev) => ({ ...prev, clearingCart: true }));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: () => {
      setLoadingStates((prev) => ({ ...prev, clearingCart: false }));
    },
    onSettled: () => {
      setLoadingStates((prev) => ({ ...prev, clearingCart: false }));
    },
  });

  const handleCheckout = async () => {
    setLoadingStates((prev) => ({ ...prev, checkingOut: true }));
    try {
      router.push("/checkout");
    } finally {
      setLoadingStates((prev) => ({ ...prev, checkingOut: false }));
    }
  };
  

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!cartItems?.length) {
    return (
      <div className="min-h-screen pt-20 px-8">
        <div className="max-w-4xl mx-auto text-center py-20">
          <h1 className="text-2xl font-light mb-6">YOUR CART IS EMPTY</h1>
          <Link href="/view-all">
            <Button variant="primary">CONTINUE SHOPPING</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
        <p className="text-red-500">
          Failed to load cart items. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-light mb-12">SHOPPING BAG</h1>

        <div className="space-y-8">
          <AnimatePresence mode="popLayout">
            {cartItems.map((item) => (
              <motion.div
                key={item._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex gap-8 pb-8 border-b border-gray-200 dark:border-gray-800"
              >
                <div className="relative w-32 aspect-[3/4]">
                  <Image
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    priority
                  />
                </div>

                <div className="flex-1 space-y-4">
                  <div className="flex justify-between">
                    <h3
                      onClick={() => router.push(`/product/${item.product._id}`)}
                      className="text-sm font-light hover:underline cursor-pointer"
                    >
                      {item.product.name}
                    </h3>
                    <button
                      onClick={() =>
                        removeFromCartMutation.mutate(item._id)
                      }
                      className="text-gray-500 hover:text-black dark:hover:text-white transition-colors"
                      disabled={loadingStates.removingItem === item._id}
                    >
                      {loadingStates.removingItem === item._id ? "REMOVING..." : <Trash2 className="w-4 h-4" />}
                    </button>
                  </div>

                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    ${item.product.price.toFixed(2)}
                  </p>

                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() =>
                        updateQuantityMutation.mutate({
                          productId: item.product._id,
                          quantity: item.quantity > 1 ? item.quantity - 1 : 1,
                        })
                      }
                      disabled={
                        item.quantity <= 1 ||
                        loadingStates.updatingItem === item.product._id
                      }
                      className="p-1 hover:bg-gray-100  rounded-full transition-colors disabled:opacity-50"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-sm">{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantityMutation.mutate({
                          productId: item.product._id,
                          quantity: item.quantity + 1,
                        })
                      }
                      disabled={loadingStates.updatingItem === item.product._id}
                      className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <div className="pt-8 space-y-6">
            <div className="flex justify-between text-lg">
              <span>Total</span>
              <span>${cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0).toFixed(2)}</span>
            </div>

            <div className="flex gap-1">
              <Button
                onClick={() => clearCartMutation.mutate()}
                disabled={loadingStates.clearingCart}
              >
                {loadingStates.clearingCart ? "CLEARING CART..." : "CLEAR CART"}
              </Button>

              <Button
                onClick={handleCheckout}
                disabled={!currentUser?.isEmailVerified || loadingStates.checkingOut}
              >
                {loadingStates.checkingOut
                  ? "CHECKING OUT..."
                  : !currentUser?.isEmailVerified
                  ? "VERIFY EMAIL TO CHECKOUT"
                  : "PROCEED TO CHECKOUT"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
