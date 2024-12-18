"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductSkeleton } from "@/components/product/ProductSkeleton";
import { PageHeader } from "@/components/layout/PageHeader";
import { GridLayout } from "@/types/gridLayout";
import { WOMEN_CATEGORIES } from "@/constants";
import { useFilter } from "@/hooks/useFilter";
import { useSort } from "@/hooks/useSort";
import { axiosInstance } from "@/lib/axios";
import { Product } from "@/types/product";

// Women's specific categories


export default function WomanPage() {
  const [layout, setLayout] = useState<GridLayout>("10x10");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortBy, setSortBy] = useState("newest");

  const { data: products, isLoading } = useQuery({
    queryKey: ['products', 'VIEW_ALL', selectedCategory, priceRange, sortBy],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get(`/products`);
        return response.data.data.products || [];
      } catch (error) {
        console.error('Failed to fetch products:', error);
        return [];
      }
    },
    initialData: [],
  });

  // Filter for women's products only
  const womenProducts = products?.filter((product: Product) => 
    product.category.toLowerCase() !== "man" && 
    product.category.toLowerCase() !== "kids"
  );

  const { filteredProducts } = useFilter({ products: womenProducts || [], selectedCategory: selectedCategory || "all", priceRange });
  const { sortedProducts } = useSort({ products: filteredProducts, sortBy });



  return (
    <div className="min-h-screen bg-white pt-20">
      <PageHeader
        title="WOMAN"
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
        categories={WOMEN_CATEGORIES}
      />

      {/* Products grid */}
      <main className="max-w-8xl mx-auto px-8 py-8">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <ProductSkeleton layout={layout} />
          ) : (
            <ProductGrid products={sortedProducts || []} layout={layout} />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
} 