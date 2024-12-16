"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/Button";
import { axiosInstance } from "@/lib/axios";

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  category: string;
  stock: string;
  imageUrl: string;
  images: FileList | null;
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
    price: "",
    category: "",
    stock: "",
    imageUrl: "",
    images: null
  });

  const [productErrors, setProductErrors] = useState<ProductFormErrors>({});

  const validateProductForm = (data: ProductFormData) => {
    const errors: ProductFormErrors = {};
    
    if (!data.name.trim()) errors.name = "Product name is required";
    if (!data.description.trim()) errors.description = "Product description is required";
    if (!data.category.trim()) errors.category = "Category is required";
    
    const price = parseFloat(data.price);
    if (isNaN(price) || price <= 0) errors.price = "Price must be a positive number";
    
    const stock = parseInt(data.stock);
    if (isNaN(stock) || stock <= 0) errors.stock = "Stock must be a positive integer";
    
    setProductErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const createProductMutation = useMutation({
    mutationFn: async (data: ProductFormData) => {
      const formData = new FormData();
      
      formData.append('name', data.name.trim());
      formData.append('description', data.description.trim());
      formData.append('price', data.price);
      formData.append('category', data.category.trim());
      formData.append('stock', data.stock);
      
      if (data.imageUrl?.trim()) {
        formData.append('imageUrl', data.imageUrl.trim());
      }

      if (data.images && data.images.length > 0) {
        const image = data.images[0];
        formData.append('image', image);
      }

      const response = await axiosInstance.post('/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setProductForm({
        name: "",
        description: "",
        price: "",
        category: "",
        stock: "",
        imageUrl: "",
        images: null
      });
      setProductErrors({});
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value } = target;
    
    if (target.type === 'file' && target.files) {
      setProductForm(prev => ({
        ...prev,
        images: target.files
      }));
    } else {
      setProductForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateProductForm(productForm)) {
      try {
        await createProductMutation.mutateAsync(productForm);
      } catch (error: unknown) {
        const apiError = error as { response?: { data?: { errors?: ApiError[] } } };
        if (apiError.response?.data?.errors) {
          const serverErrors: ProductFormErrors = {};
          apiError.response.data.errors.forEach((err) => {
            if (err.path) {
              serverErrors[err.path] = err.msg;
            }
          });
          setProductErrors(serverErrors);
        }
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
            placeholder="Product Name"
            className={`w-full border p-3 text-[11px] focus:outline-none ${
              productErrors.name ? 'border-red-500' : 'border-gray-200'
            }`}
          />
          {productErrors.name && (
            <p className="mt-1 text-[10px] text-red-500">{productErrors.name}</p>
          )}
        </div>

        <div>
          <textarea
            name="description"
            value={productForm.description}
            onChange={handleInputChange}
            placeholder="Product Description"
            className={`w-full border p-3 text-[11px] focus:outline-none min-h-[100px] ${
              productErrors.description ? 'border-red-500' : 'border-gray-200'
            }`}
          />
          {productErrors.description && (
            <p className="mt-1 text-[10px] text-red-500">{productErrors.description}</p>
          )}
        </div>

        <div>
          <input
            type="number"
            name="price"
            value={productForm.price}
            onChange={handleInputChange}
            placeholder="Price"
            step="0.01"
            min="0"
            className={`w-full border p-3 text-[11px] focus:outline-none ${
              productErrors.price ? 'border-red-500' : 'border-gray-200'
            }`}
          />
          {productErrors.price && (
            <p className="mt-1 text-[10px] text-red-500">{productErrors.price}</p>
          )}
        </div>

        <div>
          <input
            type="number"
            name="stock"
            value={productForm.stock}
            onChange={handleInputChange}
            placeholder="Stock Quantity"
            min="0"
            className={`w-full border p-3 text-[11px] focus:outline-none ${
              productErrors.stock ? 'border-red-500' : 'border-gray-200'
            }`}
          />
          {productErrors.stock && (
            <p className="mt-1 text-[10px] text-red-500">{productErrors.stock}</p>
          )}
        </div>

        <div>
          <select
            name="category"
            value={productForm.category}
            onChange={handleInputChange}
            className={`w-full border p-3 text-[11px] focus:outline-none ${
              productErrors.category ? 'border-red-500' : 'border-gray-200'
            }`}
          >
            <option value="">Select Category</option>
            <option value="MAN">MAN</option>
            <option value="WOMAN">WOMAN</option>
            <option value="KID">KIDS</option>
          </select>
          {productErrors.category && (
            <p className="mt-1 text-[10px] text-red-500">{productErrors.category}</p>
          )}
        </div>

        <div>
          <div className="text-[11px] mb-2">PRODUCT IMAGES</div>
          <div className="space-y-3">
            <input
              type="url"
              name="imageUrl"
              value={productForm.imageUrl}
              onChange={handleInputChange}
              placeholder="Image URL (Optional)"
              className="w-full border border-gray-200 p-3 text-[11px] focus:outline-none"
            />
            <div className="text-center p-3 border border-dashed border-gray-200">
              <input
                type="file"
                name="images"
                onChange={handleInputChange}
                accept="image/*"
                className="w-full text-[11px] focus:outline-none file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0 file:text-[11px]
                  file:bg-black file:text-white
                  hover:file:bg-black/90"
              />
              <p className="mt-2 text-[10px] text-gray-500">
                Or drag and drop image files here
              </p>
            </div>
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