"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductSkeleton } from "@/components/product/ProductSkeleton";
import { PageHeader } from "@/components/layout/PageHeader";
import { axiosInstance } from "@/lib/axios";
import { Product } from "@/types/product";

type GridLayout = "2x2" | "3x3" | "5x5";

const menCategories = [
  "all",
  "clothing",
  "outerwear",
  "knitwear",
  "shirts",
  "shoes",
  "accessories"
];

export default function ManPage() {
  const [layout, setLayout] = useState<GridLayout>("5x5");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortBy, setSortBy] = useState("newest");

  const { data, isLoading, error } = useQuery({
    queryKey: ['products', 'MAN', selectedCategory, priceRange, sortBy],
    queryFn: async () => {
      try {
        const params = new URLSearchParams({
          category: 'MAN',
          ...(selectedCategory && selectedCategory !== 'all' && { subCategory: selectedCategory }),
          minPrice: priceRange[0].toString(),
          maxPrice: priceRange[1].toString(),
          sortBy
        });
        
        const response = await axiosInstance.get(`/products?${params}`);
        return response.data.data.products || [];
      } catch (error) {
        console.error('Failed to fetch products:', error);
        return [];
      }
    },
    initialData: [],
  });

  const filteredProducts = data.filter((product: Product) => {
    if (selectedCategory && selectedCategory !== "all" && product.category !== selectedCategory) return false;
    if (product.price < priceRange[0] || product.price > priceRange[1]) return false;
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a: Product, b: Product) => {
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

  if (error) {
    return (
      <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
        <p className="text-red-500">Failed to load products. Please try again later.</p>
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
        categories={menCategories}
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