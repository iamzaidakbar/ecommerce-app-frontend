import { motion } from "framer-motion";
import Image from "next/image";
import { Product } from "@/services/mock.service";

interface ProductGridProps {
  products: Product[];
  layout: "2x2" | "3x3" | "5x5";
}

export function ProductGrid({ products, layout }: ProductGridProps) {
  const gridConfig = {
    "2x2": "grid-cols-2",
    "3x3": "grid-cols-3",
    "5x5": "grid-cols-5"
  };

  return (
    <motion.div
      layout
      className={`grid ${gridConfig[layout]} gap-1`}
    >
      {products.map((product) => (
        <motion.div
          key={product.id}
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          whileHover={{ y: -5 }}
          className="group cursor-pointer"
        >
          <div className="relative aspect-[3/4] overflow-hidden">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              loading="lazy"
              quality={90}
            />
          </div>
          <div className="mt-4 space-y-1">
            <h3 className="text-sm font-light">{product.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              ${product.price.toFixed(2)}
            </p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
} 