"use client";

import { motion } from "framer-motion";
import { Grid2X2, Grid3X3, LayoutGrid } from "lucide-react";
import { FilterBar } from "@/components/product/FilterBar";

type GridLayout = "2x2" | "6x6" | "10x10";

interface PageHeaderProps {
  title: string;
  itemCount?: number;
  showLayoutSwitcher?: boolean;
  showFilters?: boolean;
  layout?: GridLayout;
  onLayoutChange?: (layout: GridLayout) => void;
  selectedCategory?: string | null;
  onCategoryChange?: (category: string | null) => void;
  priceRange?: [number, number];
  onPriceRangeChange?: (range: [number, number]) => void;
  sortBy?: string;
  onSortChange?: (sort: string) => void;
  categories?: string[];
}

const layoutButtons = [
  { layout: "2x2" as GridLayout, icon: Grid2X2 },
  { layout: "6x6" as GridLayout, icon: Grid3X3 },
  { layout: "10x10" as GridLayout, icon: LayoutGrid },
];

export function PageHeader({
  title,
  itemCount,
  showLayoutSwitcher = false,
  showFilters = false,
  layout,
  onLayoutChange,
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  sortBy,
  onSortChange,
  categories,
}: PageHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-8xl mx-auto px-8 py-8">
        <div className="flex flex-col space-y-8">
          {/* Title and Layout switcher */}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-light tracking-wide text-black">{title}</h1>
            {showLayoutSwitcher && layout && onLayoutChange && (
              <div className="flex items-center space-x-2">
                {layoutButtons.map(({ layout: l, icon: Icon }) => (
                  <motion.button
                    key={l}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onLayoutChange(l)}
                    className={`p-2 rounded-md transition-colors ${
                      layout === l
                        ? "bg-black text-white"
                        : "text-gray-500 hover:text-black"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </motion.button>
                ))}
              </div>
            )}
          </div>

          {/* Filters */}
          {showFilters && onCategoryChange && priceRange && onPriceRangeChange && sortBy && onSortChange && (
            <FilterBar
              selectedCategory={selectedCategory ?? null}
              onCategoryChange={onCategoryChange}
              priceRange={priceRange}
              onPriceRangeChange={onPriceRangeChange}
              sortBy={sortBy}
              onSortChange={onSortChange}
              categories={categories}
            />
          )}

          {/* Results count */}
          {typeof itemCount !== 'undefined' && (
            <div className="text-sm font-light">
              {itemCount} ITEMS
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 