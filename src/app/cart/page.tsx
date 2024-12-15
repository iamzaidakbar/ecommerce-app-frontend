"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2, Minus, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { mockService } from "@/services/mock.service";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: cartItems, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: mockService.getCart,
  });

  const removeFromCartMutation = useMutation({
    mutationFn: mockService.removeFromCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  const updateQuantityMutation = useMutation({
    mutationFn: ({ id, quantity }: { id: string; quantity: number }) =>
      mockService.updateCartItemQuantity(id, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: mockService.getCurrentUser,
  });

  const totalAmount = cartItems?.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  ) ?? 0;

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

  return (
    <div className="min-h-screen pt-20 px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-light mb-12">SHOPPING BAG</h1>

        <div className="space-y-8">
          <AnimatePresence mode="popLayout">
            {cartItems.map((item) => (
              <motion.div
                key={item.id}
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
                  />
                </div>

                <div className="flex-1 space-y-4">
                  <div className="flex justify-between">
                    <h3 className="text-sm font-light">{item.product.name}</h3>
                    <button
                      onClick={() => removeFromCartMutation.mutate(item.id)}
                      className="text-gray-500 hover:text-black dark:hover:text-white transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    ${item.product.price.toFixed(2)}
                  </p>

                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() =>
                        updateQuantityMutation.mutate({
                          id: item.id,
                          quantity: item.quantity - 1,
                        })
                      }
                      disabled={item.quantity <= 1}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors disabled:opacity-50"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-sm">{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantityMutation.mutate({
                          id: item.id,
                          quantity: item.quantity + 1,
                        })
                      }
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
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
              <span>${totalAmount.toFixed(2)}</span>
            </div>

            <Button
              onClick={() => router.push('/checkout')}
              disabled={!user?.isVerified}
              className="text-[11px] tracking-wider py-3"
            >
              {!user?.isVerified ? (
                <span className="flex items-center space-x-2">
                  <span>VERIFY EMAIL TO CHECKOUT</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              ) : (
                <span className="flex items-center space-x-2">
                  <span>PROCEED TO CHECKOUT</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 