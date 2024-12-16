"use client"

import { PageHeader } from '@/components/layout/PageHeader';
import { ProductGrid } from '@/components/product/ProductGrid';
import { ProductSkeleton } from '@/components/product/ProductSkeleton';
import { FAVORITES_CATEGORIES } from '@/constants';
import { axiosInstance } from '@/lib/axios';
import { GridLayout } from '@/types/gridLayout';
import { Product } from '@/types/product';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence } from 'framer-motion';
import React, { useState } from 'react'



const FavoritesPage = () => {
    const [layout, setLayout] = useState<GridLayout>("5x5");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
    const [sortBy, setSortBy] = useState("newest");

    const { data, isLoading } = useQuery({
        queryKey: ['products', 'FAVORITES', selectedCategory, priceRange, sortBy],
        queryFn: async () => {
          try {
            const response = await axiosInstance.get(`/wishlist`);
            return response.data.data.wishlist.products || [];
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
}

export default FavoritesPage;