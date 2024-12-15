import { motion } from "framer-motion";

interface ProductSkeletonProps {
  layout: "2x2" | "3x3" | "5x5";
}

export function ProductSkeleton({ layout }: ProductSkeletonProps) {
  const gridConfig = {
    "2x2": "grid-cols-2",
    "3x3": "grid-cols-3",
    "5x5": "grid-cols-5"
  };

  return (
    <div className={`grid ${gridConfig[layout]} gap-4`}>
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="space-y-4">
          <motion.div
            className="relative aspect-[3/4] bg-gray-200 dark:bg-gray-800 rounded-sm"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <div className="space-y-2">
            <motion.div
              className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <motion.div
              className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </div>
      ))}
    </div>
  );
} 