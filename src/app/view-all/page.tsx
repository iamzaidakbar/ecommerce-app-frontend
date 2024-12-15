"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Grid2X2, Grid3X3, LayoutGrid } from "lucide-react";
import { mockService } from "@/services/mock.service";
import { ProductGrid } from "@/components/product/ProductGrid";
import { FilterBar } from "@/components/product/FilterBar";
import { ProductSkeleton } from "@/components/product/ProductSkeleton";
type GridLayout = "2x2" | "3x3" | "5x5";

export default function ViewAllPage() {
  const [layout, setLayout] = useState<GridLayout>("3x3");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: mockService.getProducts,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const filteredProducts = products?.filter(product => {
    if (selectedCategory && product.category !== selectedCategory) return false;
    if (product.price < priceRange[0] || product.price > priceRange[1]) return false;
    return true;
  });

  const layoutButtons = [
    { layout: "2x2" as GridLayout, icon: Grid2X2 },
    { layout: "3x3" as GridLayout, icon: Grid3X3 },
    { layout: "5x5" as GridLayout, icon: LayoutGrid },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#111111]">
      {/* Header with filters and layout options */}
      <div className="sticky top-16 z-40 bg-white/80 dark:bg-[#111111]/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex items-center justify-between">
            {/* Layout switcher */}
            <div className="flex items-center space-x-2">
              {layoutButtons.map(({ layout: l, icon: Icon }) => (
                <motion.button
                  key={l}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setLayout(l)}
                  className={`p-2 rounded-md transition-colors ${
                    layout === l
                      ? "bg-black dark:bg-white text-white dark:text-black"
                      : "text-gray-500 hover:text-black dark:hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </motion.button>
              ))}
            </div>

            {/* Filters */}
            <FilterBar
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
            />
          </div>
        </div>
      </div>

      {/* Products grid */}
      <main className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <ProductSkeleton layout={layout} />
          ) : (
            <ProductGrid products={filteredProducts || []} layout={layout} />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
} 