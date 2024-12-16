import { Product } from "@/types/product";

export const useSort = ({
  products,
  sortBy,
}: {
  products: Product[];
  sortBy: string;
}) => {
  const sortedProducts = [...products].sort((a: Product, b: Product) => {
    switch (sortBy) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "name-asc":
        return a.name.localeCompare(b.name);
      default:
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
  });
  return {
    sortedProducts,
  };
};
