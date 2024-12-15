import { motion } from "framer-motion";
import { Slider } from "@/components/ui/Slider";

const categories = [
  "all",
  "clothing",
  "accessories",
  "shoes",
  "outerwear"
];

interface FilterBarProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
}

export function FilterBar({
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange
}: FilterBarProps) {
  return (
    <div className="flex items-center space-x-8">
      {/* Categories */}
      <div className="flex items-center space-x-4">
        {categories.map(category => (
          <motion.button
            key={category}
            whileTap={{ scale: 0.95 }}
            onClick={() => onCategoryChange(category === 'all' ? null : category)}
            className={`text-sm font-light tracking-wide transition-colors ${
              (category === 'all' && !selectedCategory) || category === selectedCategory
                ? "text-black dark:text-white"
                : "text-gray-500 hover:text-black dark:hover:text-white"
            }`}
          >
            {category.toUpperCase()}
          </motion.button>
        ))}
      </div>

      {/* Price Range */}
      <div className="w-64">
        <Slider
          min={0}
          max={1000}
          step={10}
          value={priceRange}
          onValueChange={onPriceRangeChange}
        />
      </div>
    </div>
  );
} 