import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { Product } from "@/types/product";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";

interface ProductGridProps {
  products: Product[];
  layout: "2x2" | "6x6" | "10x10";
}

export function ProductGrid({ products, layout }: ProductGridProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const gridConfig = {
    "2x2": "grid-cols-2",
    "6x6": "grid-cols-6",
    "10x10": "grid-cols-10"
  };

  const addToCartMutation = useMutation({
    mutationFn: async (productId: string) => {
      const response = await axiosInstance.post('/cart', {
        productId,
        quantity: 1
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error) => {
      console.error('Failed to add to cart:', error);
      // You might want to add a toast notification here
    }
  });

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const productCard = target.closest('[data-product-id]');
    const addToCartButton = target.closest('[data-add-to-cart]');

    if (addToCartButton) {
      e.preventDefault();
      e.stopPropagation();
      const productId = addToCartButton.getAttribute('data-add-to-cart');
      if (productId) {
        addToCartMutation.mutate(productId);
      }
    } else if (productCard) {
      const productId = productCard.getAttribute('data-product-id');
      if (productId) {
        router.push(`/product/${productId}`);
      }
    }
  };

  return (
    <motion.div
      layout
      className={`grid ${gridConfig[layout]} border-collapse border-l border-black ${products?.length > 10 ? "border-t" : ''}`}
      onClick={handleClick}
    >
      {products.map((product: Product) => (
        <motion.div
          key={product._id}
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`group cursor-pointer border-r border-black ${products?.length < 10 ? "border-t" : ''}`}
          data-product-id={product._id}
        >
          <div className="relative aspect-[3/4] overflow-hidden">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              quality={90}
              priority
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors">
              <motion.button
                initial={{ opacity: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                data-add-to-cart={product._id}
                className="absolute bottom-4 right-4 p-2 bg-white text-black rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ShoppingBag className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
          {layout !== "10x10" && (
            <div className="py-2 px-2 border-b border-t border-black">
              <h3 className="text-xs font-light uppercase">{product.name}</h3>
              <p className="text-xs font-light uppercase">
                ${product.price.toFixed(2)}
            </p>
            </div>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
} 