"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductSkeleton } from "@/components/product/ProductSkeleton";
import { PageHeader } from "@/components/layout/PageHeader";
import { axiosInstance } from "@/lib/axios";
import { GridLayout } from "@/types/gridLayout";
import { MAN_CATEGORIES } from "@/constants";
import { useSort } from "@/hooks/useSort";
import { useFilter } from "@/hooks/useFilter";

export default function ManPage() {
  const [layout, setLayout] = useState<GridLayout>("10x10");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortBy, setSortBy] = useState("newest");

 // Fetch products only once on initial load
 const { data: allProducts = [], isLoading, error } = useQuery({
  queryKey: ["products", "MAN"],
  queryFn: async () => {
    try {
      const response = await axiosInstance.get(`/products?category=MAN`);
      return response.data.data.products || [];
    } catch (error) {
      console.error("Failed to fetch products:", error);
      throw error; // Rethrow to handle in React Query
    }
  },
});

  // Apply filtering and sorting on the frontend
  const { filteredProducts } = useFilter({
    products: allProducts,
    selectedCategory: selectedCategory || "all",
    priceRange,
  });
  const { sortedProducts } = useSort({ products: filteredProducts, sortBy });

  if (error) {
    return (
      <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
        <p className="text-red-500">
          Failed to load products. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-20">
      <PageHeader
        title="MAN"
        showLayoutSwitcher
        showFilters
        layout={layout}
        onLayoutChange={setLayout}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        priceRange={priceRange}
        onPriceRangeChange={setPriceRange}
        sortBy={sortBy}
        onSortChange={setSortBy}
        itemCount={sortedProducts?.length || 0}
        categories={MAN_CATEGORIES}
      />

      {/* Products grid */}
      <main className="max-w-8xl mx-auto px-8 py-8">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <ProductSkeleton layout={layout} />
          ) : (
            <ProductGrid products={sortedProducts} layout={layout} />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
