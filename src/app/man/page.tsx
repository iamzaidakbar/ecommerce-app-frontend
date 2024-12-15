"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { mockService } from "@/services/mock.service";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductSkeleton } from "@/components/product/ProductSkeleton";
import { PageHeader } from "@/components/layout/PageHeader";

type GridLayout = "2x2" | "3x3" | "5x5";

// Men's specific categories
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

  const { data: allProducts, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: mockService.getProducts,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Filter for men's products only
  const menProducts = allProducts?.filter(product => 
    product.category.toLowerCase() !== "women" && 
    product.category.toLowerCase() !== "kids"
  );

  const filteredProducts = menProducts?.filter(product => {
    if (selectedCategory && selectedCategory !== "all" && product.category !== selectedCategory) return false;
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

  return (
    <div className="min-h-screen bg-white dark:bg-[#111111] pt-20">
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
        itemCount={sortedAndFilteredProducts?.length || 0}
        categories={menCategories}
      />

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