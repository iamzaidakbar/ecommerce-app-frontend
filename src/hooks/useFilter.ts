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
  const filteredProducts = products.filter((product: Product) => {
    if (
      selectedCategory &&
      selectedCategory !== "all" &&
      product.category !== selectedCategory
    )
      return false;
    if (product.price < priceRange[0] || product.price > priceRange[1])
      return false;
    return true;
  });

  return {
    filteredProducts,
  };
};
