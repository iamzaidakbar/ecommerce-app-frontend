import { motion } from "framer-motion";
import { Slider } from "@/components/ui/Slider";
import { ChevronDown } from "lucide-react";

const sortOptions = [
  { value: "newest", label: "NEWEST" },
  { value: "price-asc", label: "PRICE: LOW TO HIGH" },
  { value: "price-desc", label: "PRICE: HIGH TO LOW" },
  { value: "name-asc", label: "NAME: A TO Z" },
];

interface FilterBarProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  categories?: string[];
}

const defaultCategories = ["all", "clothing", "accessories", "shoes", "outerwear"];

export function FilterBar({
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  sortBy,
  onSortChange,
  categories = defaultCategories,
}: FilterBarProps) {
  return (
    <div className="flex flex-col space-y-8">
      {/* Categories */}
      <div className="flex items-center space-x-8">
        {categories.map(category => (
          <motion.button
            key={category}
            whileTap={{ scale: 0.95 }}
            onClick={() => onCategoryChange(category === 'all' ? null : category)}
            className={`text-xs font-light tracking-widest transition-colors ${
              (category === 'all' && !selectedCategory) || category === selectedCategory
                ? "text-black dark:text-white"
                : "text-gray-500 hover:text-black dark:hover:text-white"
            }`}
          >
            {category.toUpperCase()}
          </motion.button>
        ))}
      </div>

      {/* Filters row */}
      <div className="flex items-center justify-between border-t border-b border-gray-200 dark:border-gray-800 py-4">
        {/* Price Range */}
        <div className="flex items-center space-x-6">
          <span className="text-xs font-light tracking-wider">PRICE RANGE</span>
          <div className="w-64">
            <Slider
              min={0}
              max={1000}
              step={10}
              value={priceRange}
              onValueChange={onPriceRangeChange}
            />
          </div>
          <div className="text-xs font-light space-x-2 w-24">
            <span>${priceRange[0]}</span>
            <span>-</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>

        {/* Sort Dropdown */}
        <div className="relative group">
          <button className="flex items-center space-x-2 text-xs font-light tracking-wider hover:opacity-70 transition-opacity">
            <span>SORT BY: {sortOptions.find(opt => opt.value === sortBy)?.label}</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
          <div className="absolute right-0 top-full mt-2 w-48 py-1 bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
            {sortOptions.map(option => (
              <button
                key={option.value}
                onClick={() => onSortChange(option.value)}
                className={`w-full text-left px-4 py-2 text-xs font-light tracking-wider transition-colors ${
                  sortBy === option.value
                    ? "text-black dark:text-white"
                    : "text-gray-500 hover:text-black dark:hover:text-white"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 