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
  const [sortBy, setSortBy] = useState("newest");

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

  const sortedAndFilteredProducts = filteredProducts?.sort((a, b) => {
    switch (sortBy) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "name-asc":
        return a.name.localeCompare(b.name);
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  const layoutButtons = [
    { layout: "2x2" as GridLayout, icon: Grid2X2 },
    { layout: "3x3" as GridLayout, icon: Grid3X3 },
    { layout: "5x5" as GridLayout, icon: LayoutGrid },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#111111] pt-20">
      {/* Header with filters and layout options */}
      <div className="bg-white dark:bg-[#111111] border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-8xl mx-auto px-8 py-8">
          <div className="flex flex-col space-y-8">
            {/* Title and Layout switcher */}
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-extralight tracking-wide">VIEW ALL</h1>
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
                    <Icon className="w-4 h-4" />
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Filters */}
            <FilterBar
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />

            {/* Results count */}
            <div className="text-sm font-light">
              {sortedAndFilteredProducts?.length || 0} ITEMS
            </div>
          </div>
        </div>
      </div>

      {/* Products grid */}
      <main className="max-w-8xl mx-auto px-8 py-8">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <ProductSkeleton layout={layout} />
          ) : (
            <ProductGrid products={sortedAndFilteredProducts || []} layout={layout} />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
} 