"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductSkeleton } from "@/components/product/ProductSkeleton";
import { FAVORITES_CATEGORIES } from "@/constants";
import { useFilter } from "@/hooks/useFilter";
import { useSort } from "@/hooks/useSort";
import { axiosInstance } from "@/lib/axios";
import { GridLayout } from "@/types/gridLayout";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import React, { useState } from "react";

const FavoritesPage = () => {
  const [layout, setLayout] = useState<GridLayout>("10x10");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortBy, setSortBy] = useState("newest");

  const { data, isLoading } = useQuery({
    queryKey: ["products", "FAVORITES", selectedCategory, priceRange, sortBy],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get(`/wishlist`);
        return response.data.data.wishlist.products || [];
      } catch (error) {
        console.error("Failed to fetch products:", error);
        return [];
      }
    },
    initialData: [],
  });

  const { filteredProducts } = useFilter({
    products: data,
    selectedCategory: selectedCategory || "all",
    priceRange,
  });

  const { sortedProducts } = useSort({ products: filteredProducts, sortBy });

  return (
    <div className="min-h-screen bg-white pt-20">
      <PageHeader
        title="FAVORITES"
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
        categories={FAVORITES_CATEGORIES}
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
};

export default FavoritesPage;
