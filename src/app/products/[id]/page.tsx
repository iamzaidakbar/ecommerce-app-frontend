"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart, Minus, Plus } from "lucide-react";
import Image from "next/image";
import { mockService } from "@/services/mock.service";
import { Button } from "@/components/ui/Button";

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  const queryClient = useQueryClient();
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => mockService.getProduct(productId),
  });

  const { data: favorites = [] } = useQuery({
    queryKey: ['favorites'],
    queryFn: mockService.getFavorites,
  });

  const addToCartMutation = useMutation({
    mutationFn: () => mockService.addToCart(productId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: () => mockService.toggleFavorite(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });

  const isFavorite = favorites.some(fav => fav.productId === productId);

  if (isLoading || !product) {
    return (
      <div className="min-h-screen pt-40 px-8">
        <div className="max-w-6xl mx-auto animate-pulse">
          <div className="grid grid-cols-2 gap-12">
            <div className="aspect-[3/4] bg-gray-200" />
            <div className="space-y-8 py-8">
              <div className="h-8 bg-gray-200 w-2/3" />
              <div className="h-6 bg-gray-200 w-1/4" />
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 w-full" />
                <div className="h-4 bg-gray-200 w-5/6" />
                <div className="h-4 bg-gray-200 w-4/6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-40 px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 gap-12">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative aspect-[3/4]"
          >
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="py-8"
          >
            <div className="max-w-[360px]">
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-[11px] uppercase tracking-wider">{product.name}</h1>
                <button onClick={() => toggleFavoriteMutation.mutate()}>
                  <Heart
                    className={`w-4 h-4 ${isFavorite ? 'fill-black' : ''}`}
                  />
                </button>
              </div>

              <div className="text-[11px] mb-6">₹ {product.price.toFixed(2)}</div>

              <div className="text-[11px] text-gray-600 mb-8">
                MRP incl. of all taxes
              </div>

              <div className="mb-8">
                <div className="text-[11px] mb-4">
                  Model height: 190 cm | Size: L
                </div>
                <div className="text-[11px] leading-relaxed">
                  {product.description}
                </div>
              </div>

              {/* Size Selection */}
              <div className="mb-8">
                <div className="text-[11px] mb-2">BLACK | {product.id}</div>
                <div className="grid grid-cols-2 gap-1 mb-4">
                  {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                    <button
                      key={size}
                      className="py-3 border text-[11px] hover:bg-black hover:text-white transition-colors"
                    >
                      {size}
                    </button>
                  ))}
                </div>
                <div className="text-[11px] text-gray-600">
                  This product has a smaller fit than usual.
                </div>
              </div>

              {/* Quantity and Add to Cart */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border p-3">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                      disabled={quantity <= 1}
                      className="text-gray-500 disabled:opacity-50"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-[11px] w-4 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(prev => prev + 1)}
                      disabled={quantity >= product.stock}
                      className="text-gray-500 disabled:opacity-50"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="text-[11px]">
                    {product.stock} units available
                  </div>
                </div>

                <Button
                  onClick={() => addToCartMutation.mutate()}
                  isLoading={addToCartMutation.isPending}
                  loadingText="ADDING..."
                  className="text-[11px] tracking-wider py-3"
                >
                  ADD TO BAG
                </Button>
              </div>

              {/* Additional Info */}
              <div className="mt-8 space-y-4 text-[11px]">
                <button className="w-full text-left py-4 border-t flex items-center justify-between hover:bg-black/5">
                  <span>CHECK IN-STORE AVAILABILITY</span>
                  <Plus className="w-3 h-3" />
                </button>
                <button className="w-full text-left py-4 border-t flex items-center justify-between hover:bg-black/5">
                  <span>SHIPPING, EXCHANGES AND RETURNS</span>
                  <Plus className="w-3 h-3" />
                </button>
                <button className="w-full text-left py-4 border-t flex items-center justify-between hover:bg-black/5">
                  <span>PRODUCT MEASUREMENTS</span>
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 