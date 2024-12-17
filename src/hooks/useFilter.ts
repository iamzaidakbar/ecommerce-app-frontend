import { Product } from "@/types/product";

export const useFilter = ({
  products,
  selectedCategory,
  priceRange,
}: {
  products: Product[];
  selectedCategory: string;
  priceRange: [number, number];
}) => {
  // Map filters to their corresponding categories
  const categoryMap: Record<string, string[]> = {
    all: [], // Include all categories
    clothing: ["MAN", "WOMAN"], // CLOTHING includes MAN and WOMAN
    shirts: ["MAN", "WOMAN"],
    jeans: ["MAN", "WOMAN"],
    accessories: ["ACCESSORIES"], // ACCESSORIES is self-mapped
    shoes: ["SHOES"], // SHOES is self-mapped
    outerwear: ["OUTERWEAR"], // OUTERWEAR is self-mapped
  };

  const filteredProducts = products.filter((product: Product) => {
    // If selectedCategory is not "all", check against the mapped categories
    if (
      selectedCategory &&
      selectedCategory !== "all" &&
      !categoryMap[selectedCategory.toLowerCase()]?.includes(product.category)
    )
      return false;

    // Filter by price range
    if (product.price < priceRange[0] || product.price > priceRange[1])
      return false;

    return true;
  });

  return {
    filteredProducts,
  };
};
