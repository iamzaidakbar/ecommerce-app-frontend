"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/Button";
import { axiosInstance } from "@/lib/axios";

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  imageUrl: string;
}

type ProductFormErrors = {
  [K in keyof ProductFormData]?: string;
};

interface ApiError {
  type: string;
  msg: string;
  path: keyof ProductFormData;
  location: string;
}

export default function ProductsSection() {
  const queryClient = useQueryClient();
  const [productForm, setProductForm] = useState<ProductFormData>({
    name: "",
    description: "",
    price: 0,
    category: "",
    stock: 0,
    imageUrl: "",
  });


  const createProductMutation = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.post('/products', productForm);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setProductForm({
        name: "",
        description: "",
        price: 0,
        category: "",
        stock: 0,
        imageUrl: "",
      });
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProductForm(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createProductMutation.mutateAsync();
    } catch (error: unknown) {
        const apiError = error as { response?: { data?: { errors?: ApiError[] } } };
        if (apiError.response?.data?.errors) {
          const serverErrors: ProductFormErrors = {};
          apiError.response.data.errors.forEach((err) => {
            if (err.path) {
              serverErrors[err.path] = err.msg;
            }
          });
        }
      }
  };

  return (
    <div className="space-y-6">
      <div className="text-[11px] mb-4">MANAGE PRODUCTS</div>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-[400px]">
        <div>
          <input
            type="text"
            name="name"
            value={productForm.name}
            onChange={handleInputChange}
            placeholder="Product Name *"
            className={`w-full border p-3 text-[11px] focus:outline-none`}
          />
        </div>

        <div>
          <textarea
            name="description"
            value={productForm.description}
            onChange={handleInputChange}
            placeholder="Product Description *"
            className={`w-full border p-3 text-[11px] focus:outline-none min-h-[100px]`}
          />
        </div>

        <div>
          <input
            type="number"
            name="price"
            value={productForm.price}
            onChange={handleInputChange}
            placeholder="Price *"
            step="0.01"
            min="0"
            className={`w-full border p-3 text-[11px] focus:outline-none`}
          />
        </div>

        <div>
          <input
            type="number"
            name="stock"
            value={productForm.stock}
            onChange={handleInputChange}
            placeholder="Stock Quantity *"
            min="0"
            className={`w-full border p-3 text-[11px] focus:outline-none`}
          />
        </div>

        <div>
          <select
            name="category"
            value={productForm.category}
            onChange={handleInputChange}
            className={`w-full border p-3 text-[11px] focus:outline-none`}
          >
            <option value="">Select Category *</option>
            <option value="MAN">MAN</option>
            <option value="WOMAN">WOMAN</option>
            <option value="KID">KIDS</option>
          </select>
        </div>

        <div>
          <div className="space-y-3">
            <input
              type="url"
              name="imageUrl"
              value={productForm.imageUrl}
              onChange={handleInputChange}
              placeholder="Image URL *"
              className="w-full border border-gray-200 p-3 text-[11px] focus:outline-none"
            />
          </div>
        </div>

        <Button
          type="submit"
          className="text-[11px] w-full"
          isLoading={createProductMutation.isPending}
          loadingText="CREATING..."
        >
          CREATE PRODUCT
        </Button>

        {createProductMutation.isSuccess && (
          <p className="text-[11px] text-green-600">
            Product created successfully
          </p>
        )}

        {createProductMutation.isError && (
          <p className="text-[11px] text-red-600">
            Failed to create product
          </p>
        )}
      </form>
    </div>
  );
} 